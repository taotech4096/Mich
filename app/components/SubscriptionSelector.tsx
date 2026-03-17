import {useState} from 'react';
import {ToggleGroup, ToggleGroupItem} from '~/components/ui/toggle-group';

export type SellingPlanNode = {
  id: string;
  name: string;
  options: Array<{name: string; value: string}>;
};

export type SellingPlanGroupNode = {
  name: string;
  sellingPlans: {nodes: SellingPlanNode[]};
};

type Frequency = 'semanal' | 'quincenal';
type DeliveryDay = 'martes' | 'viernes';

function resolvePlanId(
  plans: SellingPlanNode[],
  frequency: Frequency,
  day: DeliveryDay,
): string | null {
  // Plans are named "Semanal — Martes", "Quincenal — Viernes", etc.
  const freqLabel = frequency === 'semanal' ? 'Semanal' : 'Quincenal';
  const dayLabel = day === 'martes' ? 'Martes' : 'Viernes';
  const match = plans.find(
    (p) =>
      p.name.toLowerCase().includes(freqLabel.toLowerCase()) &&
      p.name.toLowerCase().includes(dayLabel.toLowerCase()),
  );
  return match?.id ?? null;
}

export function SubscriptionSelector({
  sellingPlanGroups,
  deliveryDayPreference,
  onSellingPlanChange,
}: {
  sellingPlanGroups: SellingPlanGroupNode[];
  deliveryDayPreference?: string | null;
  onSellingPlanChange: (sellingPlanId: string | null) => void;
}) {
  const allPlans = sellingPlanGroups.flatMap((g) => g.sellingPlans.nodes);

  const [purchaseType, setPurchaseType] = useState<'unica' | 'suscripcion'>('unica');
  const [frequency, setFrequency] = useState<Frequency>('semanal');
  const [day, setDay] = useState<DeliveryDay>(
    (deliveryDayPreference as DeliveryDay) ?? 'martes',
  );

  if (allPlans.length === 0) return null;

  function handlePurchaseTypeChange(value: string) {
    if (!value) return;
    const newType = value as 'unica' | 'suscripcion';
    setPurchaseType(newType);
    if (newType === 'unica') {
      onSellingPlanChange(null);
    } else {
      onSellingPlanChange(resolvePlanId(allPlans, frequency, day));
    }
  }

  function handleFrequencyChange(value: string) {
    if (!value) return;
    const newFrequency = value as Frequency;
    setFrequency(newFrequency);
    if (purchaseType === 'suscripcion') {
      onSellingPlanChange(resolvePlanId(allPlans, newFrequency, day));
    }
  }

  function handleDayChange(value: string) {
    if (!value) return;
    const newDay = value as DeliveryDay;
    setDay(newDay);
    if (purchaseType === 'suscripcion') {
      onSellingPlanChange(resolvePlanId(allPlans, frequency, newDay));
    }
  }

  return (
    <div className="space-y-4">
      {/* Purchase type toggle */}
      <ToggleGroup
        type="single"
        value={purchaseType}
        onValueChange={handlePurchaseTypeChange}
        variant="outline"
        aria-label="Tipo de compra"
      >
        <ToggleGroupItem value="unica" aria-label="Compra única">
          Compra única
        </ToggleGroupItem>
        <ToggleGroupItem value="suscripcion" aria-label="Suscripción">
          Suscripción
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Frequency + day sub-toggles — only visible when "Suscripción" is selected */}
      {purchaseType === 'suscripcion' && (
        <div className="space-y-3 rounded-lg border border-border p-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Frecuencia
            </p>
            <ToggleGroup
              type="single"
              value={frequency}
              onValueChange={handleFrequencyChange}
              variant="outline"
              aria-label="Frecuencia de entrega"
            >
              <ToggleGroupItem value="semanal" aria-label="Semanal">
                Semanal
              </ToggleGroupItem>
              <ToggleGroupItem value="quincenal" aria-label="Quincenal">
                Quincenal
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Día de entrega
            </p>
            <ToggleGroup
              type="single"
              value={day}
              onValueChange={handleDayChange}
              variant="outline"
              aria-label="Día de entrega"
            >
              <ToggleGroupItem value="martes" aria-label="Martes">
                Martes
              </ToggleGroupItem>
              <ToggleGroupItem value="viernes" aria-label="Viernes">
                Viernes
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      )}
    </div>
  );
}
