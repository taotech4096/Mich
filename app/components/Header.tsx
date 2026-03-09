import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {ShoppingCart, User, Search, Menu} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-burlap/20">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <NavLink
          prefetch="intent"
          to="/"
          end
          className="font-display text-2xl text-dark tracking-wide hover:text-gold transition-colors"
        >
          MICH
        </NavLink>
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();

  if (viewport === 'mobile') {
    return (
      <nav className="flex flex-col gap-4 p-4" role="navigation">
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          to="/"
          className={({isActive}) =>
            `text-lg font-sans ${isActive ? 'text-gold font-semibold' : 'text-dark'}`
          }
        >
          Inicio
        </NavLink>
        {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
          if (!item.url) return null;
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavLink
              end
              key={item.id}
              onClick={close}
              prefetch="intent"
              to={url}
              className={({isActive}) =>
                `text-lg font-sans ${isActive ? 'text-gold font-semibold' : 'text-dark'}`
              }
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-8" role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            to={url}
            className={({isActive}) =>
              `relative font-sans text-sm tracking-wide transition-colors ${
                isActive
                  ? 'text-gold after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-gold'
                  : 'text-dark hover:text-gold'
              }`
            }
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center gap-2" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink
        prefetch="intent"
        to="/account"
        className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-dark hover:text-gold transition-colors"
        aria-label="Cuenta"
      >
        <User size={20} />
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="md:hidden flex items-center justify-center w-10 h-10 text-dark hover:text-gold transition-colors"
      onClick={() => open('mobile')}
      aria-label="Abrir menu"
    >
      <Menu size={22} />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-dark hover:text-gold transition-colors"
      onClick={() => open('search')}
      aria-label="Buscar"
    >
      <Search size={20} />
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-dark hover:text-gold transition-colors relative"
      onClick={() => {
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      aria-label={count ? `Carrito, ${count} productos` : 'Carrito'}
    >
      <ShoppingCart size={20} />
      {count != null && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[10px] font-sans font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {count}
        </span>
      )}
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Productos',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'Nuestra Historia',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'FAQ',
      type: 'HTTP',
      url: '/pages/faq',
      items: [],
    },
  ],
};
