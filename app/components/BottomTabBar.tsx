import {NavLink} from 'react-router';
import {Suspense} from 'react';
import {Await, useAsyncValue} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {LucideIcon} from 'lucide-react';
import {Home, ShoppingBag, ShoppingCart, User} from 'lucide-react';

interface BottomTabBarProps {
  cart: Promise<CartApiQueryFragment | null>;
}

export function BottomTabBar({cart}: BottomTabBarProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-dark border-t border-dark-surface md:hidden"
      role="navigation"
      aria-label="Navegacion principal"
    >
      <div className="flex items-center justify-around h-16">
        <TabLink to="/" icon={Home} label="Inicio" end />
        <TabLink to="/collections" icon={ShoppingBag} label="Productos" />
        <CartTabLink cart={cart} />
        <TabLink to="/account" icon={User} label="Cuenta" />
      </div>
    </nav>
  );
}

function TabLink({
  to,
  icon: Icon,
  label,
  end,
  badge,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
  badge?: number | null;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      prefetch="intent"
      className={({isActive}) =>
        `flex flex-col items-center justify-center min-w-[48px] min-h-[48px] relative ${
          isActive ? 'text-gold' : 'text-burlap'
        }`
      }
      aria-label={badge ? `${label}, ${badge} productos` : label}
    >
      {({isActive}) => (
        <>
          <Icon size={22} className={isActive ? 'text-gold' : 'text-burlap'} />
          {isActive && (
            <span className="text-[10px] font-sans mt-0.5 text-gold">
              {label}
            </span>
          )}
          {badge != null && badge > 0 && (
            <span className="absolute -top-0.5 right-0 bg-gold text-white text-[10px] font-sans font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function CartTabLink({cart}: {cart: Promise<CartApiQueryFragment | null>}) {
  return (
    <Suspense fallback={<TabLink to="/cart" icon={ShoppingCart} label="Carrito" />}>
      <Await resolve={cart}>
        <CartTabBadge />
      </Await>
    </Suspense>
  );
}

function CartTabBadge() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return (
    <TabLink
      to="/cart"
      icon={ShoppingCart}
      label="Carrito"
      badge={cart?.totalQuantity ?? 0}
    />
  );
}
