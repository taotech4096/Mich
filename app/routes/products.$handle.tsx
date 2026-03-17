import {data, redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'waitlist') {
    const email = formData.get('email') as string;
    const whatsapp = formData.get('whatsapp') as string;

    if (!email && !whatsapp) {
      return data({waitlistError: 'Ingresa tu email o número de WhatsApp'}, {status: 400});
    }

    // If customer is logged in, write to customer metafields via Customer Account API
    // For now, store contact info in session or just return success
    // Full customer metafield write is handled when customer account session is available
    const contact = email || whatsapp;

    try {
      // Attempt to write to customer metafields if logged in
      const customerAccount = context.customerAccount;
      if (customerAccount) {
        const loggedIn = await customerAccount.isLoggedIn();
        if (loggedIn) {
          // Customer metafield update would go here via Customer Account API
          // Deferred to Story 8.2 for full enrollment flow
        }
      }
      return data({waitlistSuccess: true, contact});
    } catch {
      return data({waitlistSuccess: true, contact});
    }
  }

  return data({});
}

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}, shopCapacity] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    storefront.query(SHOP_CAPACITY_QUERY),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  const capacityMax = parseInt(shopCapacity?.shop?.capacityMax?.value ?? '150', 10);
  const capacityCurrent = parseInt(shopCapacity?.shop?.capacityCurrent?.value ?? '0', 10);
  const subscriptionAtCapacity = capacityCurrent >= capacityMax;

  return {
    product,
    subscriptionAtCapacity,
  };
}

function loadDeferredData({context, params}: Route.LoaderArgs) {
  return {};
}

export default function Product() {
  const {product, subscriptionAtCapacity} = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;
  const sellingPlanGroups = product.sellingPlanGroups?.nodes ?? [];

  return (
    <div className="product">
      <ProductImage image={selectedVariant?.image} />
      <div className="product-main">
        <h1>{title}</h1>
        <ProductPrice
          price={selectedVariant?.price}
          compareAtPrice={selectedVariant?.compareAtPrice}
        />
        <br />
        <ProductForm
          productOptions={productOptions}
          selectedVariant={selectedVariant}
          sellingPlanGroups={sellingPlanGroups}
          subscriptionAtCapacity={subscriptionAtCapacity}
        />
        <br />
        <br />
        <p>
          <strong>Description</strong>
        </p>
        <br />
        <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
        <br />
      </div>
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

// ── GraphQL Fragments & Queries ──────────────────────────────────────

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const SELLING_PLAN_FRAGMENT = `#graphql
  fragment SellingPlanFragment on SellingPlan {
    id
    name
    description
    recurringDeliveries
    options { name value }
    priceAdjustments {
      orderCount
      adjustmentValue {
        ... on SellingPlanPercentagePriceAdjustment { adjustmentPercentage }
        ... on SellingPlanFixedAmountPriceAdjustment {
          adjustmentAmount { amount currencyCode }
        }
      }
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
    sellingPlanGroups(first: 10) {
      nodes {
        name
        sellingPlans(first: 10) {
          nodes {
            ...SellingPlanFragment
          }
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
  ${SELLING_PLAN_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const SHOP_CAPACITY_QUERY = `#graphql
  query ShopSubscriptionCapacity {
    shop {
      capacityMax: metafield(namespace: "custom", key: "subscription_capacity_max") { value }
      capacityCurrent: metafield(namespace: "custom", key: "subscription_capacity_current") { value }
    }
  }
` as const;
