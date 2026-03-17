import {useState} from 'react';
import {useFetcher} from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {Input} from '~/components/ui/input';
import {Button} from '~/components/ui/button';

export function SubscriptionWaitlistDialog() {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();

  const isSubmitting = fetcher.state === 'submitting';
  const success = fetcher.data?.waitlistSuccess === true;
  const error = fetcher.data?.waitlistError as string | undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/50"
        >
          <span className="block font-semibold text-foreground">Lista de espera</span>
          <span className="text-muted-foreground">
            Cupos disponibles limitados — calidad sobre cantidad
          </span>
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Te avisamos cuando haya un lugar?</DialogTitle>
          <DialogDescription>
            Mantenemos un límite de suscripciones para garantizar la frescura y calidad
            de cada entrega. Déjanos tu contacto y te avisamos en cuanto se libere un cupo.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-4 text-center">
            <p className="font-semibold text-foreground">
              ¡Listo! Te avisaremos cuando se libere un cupo
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Gracias por tu interés en Suscripciones Mich
            </p>
          </div>
        ) : (
          <fetcher.Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="waitlist" />

            <div className="space-y-2">
              <label htmlFor="waitlist-email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="waitlist-email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="waitlist-whatsapp" className="text-sm font-medium text-foreground">
                WhatsApp <span className="text-muted-foreground">(opcional)</span>
              </label>
              <Input
                id="waitlist-whatsapp"
                name="whatsapp"
                type="tel"
                placeholder="+52 55 1234 5678"
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Guardando…' : 'Quiero mi lugar'}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
