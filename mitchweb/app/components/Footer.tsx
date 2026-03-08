import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-dark text-cream pb-20 md:pb-0">
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
              <div className="flex flex-col md:flex-row md:justify-between gap-8">
                {/* Brand column */}
                <div className="space-y-3">
                  <span className="font-display text-2xl text-gold tracking-wide">
                    MICH
                  </span>
                  <p className="text-burlap text-sm font-sans max-w-xs">
                    Jocoque artesanal y yogurt de herencia mediterránea. Hecho
                    en México con tradición libanesa.
                  </p>
                </div>

                {/* Policy links */}
                {footer?.menu && header.shop.primaryDomain?.url && (
                  <div className="space-y-3">
                    <h3 className="font-sans text-sm font-semibold text-gold uppercase tracking-wider">
                      Legal
                    </h3>
                    <FooterMenu
                      menu={footer.menu}
                      primaryDomainUrl={header.shop.primaryDomain.url}
                      publicStoreDomain={publicStoreDomain}
                    />
                  </div>
                )}
              </div>

              {/* Bottom bar */}
              <div className="mt-10 pt-6 border-t border-cream/10 flex flex-col md:flex-row md:justify-between items-center gap-2">
                <p className="text-burlap text-xs font-sans">
                  &copy; {new Date().getFullYear()} Jocoque & Yogurt Mich.
                  Todos los derechos reservados.
                </p>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="flex flex-col gap-2" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a
            href={url}
            key={item.id}
            rel="noopener noreferrer"
            target="_blank"
            className="text-burlap hover:text-gold text-sm font-sans transition-colors"
          >
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            to={url}
            className={({isActive}) =>
              `text-sm font-sans transition-colors ${
                isActive ? 'text-gold' : 'text-burlap hover:text-gold'
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

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Aviso de Privacidad',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Política de Devoluciones',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Política de Envío',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Términos y Condiciones',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};
