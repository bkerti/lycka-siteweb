import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface VisitData {
  date?: string;
  hour?: number;
  count: string;
}

interface ChartData {
  name: string;
  visiteurs: number;
  hourly?: { [hour: string]: number };
  isPeak?: boolean;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartData;
    return (
      <div className="p-2 bg-background border border-border rounded-lg shadow-lg">
        <p className="label font-bold">{`Date : ${label}`}</p>
        <p className="intro">{`Total Visiteurs : ${data.visiteurs}`}</p>
        {data.hourly && Object.keys(data.hourly).length > 0 && (
          <div className="mt-2">
            <p className="font-semibold">Détail par heure :</p>
            <ul className="list-disc pl-4">
              {Object.entries(data.hourly).map(([hour, count]) => (
                <li key={hour}>{`${hour}h : ${count} visiteur(s)`}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return null;
};

const VisitorChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState('month'); // day, week, month, year
  const { toast } = useToast();

  useEffect(() => {
    const fetchVisitorData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          throw new Error("Authentification requise");
        }

        const response = await fetch(`/api/analytics/visits-summary?range=${range}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erreur lors de la récupération des données");
        }

        const data: VisitData[] = await response.json();
        
        let formattedData: ChartData[] = [];

        if (range === 'day') {
          let peakHour = -1;
          let maxVisits = -1;

          const hourlyData = data.map(item => {
            const visits = parseInt(item.count, 10);
            if (visits > maxVisits) {
              maxVisits = visits;
              peakHour = item.hour!;
            }
            return {
              name: `${String(item.hour).padStart(2, '0')}:00`,
              visiteurs: visits,
            };
          });

          // Add isPeak property for highlighting
          formattedData = hourlyData.map(item => ({
            ...item,
            isPeak: parseInt(item.name.split(':')[0]) === peakHour
          }));

        } else {
          const aggregatedData = data.reduce((acc, item) => {
            const dateObj = new Date(item.date!);
            let dateLabel = '';
            if (range === 'week' || range === 'month') {
              dateLabel = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
            } else if (range === 'year') {
              dateLabel = dateObj.toLocaleString('fr-FR', { month: 'long' });
            }

            if (!acc[dateLabel]) {
              acc[dateLabel] = { total: 0, hourly: {} };
            }
            
            const count = parseInt(item.count, 10);
            const hour = String(item.hour).padStart(2, '0');

            acc[dateLabel].total += count;
            if(item.hour) {
                acc[dateLabel].hourly[hour] = (acc[dateLabel].hourly[hour] || 0) + count;
            }

            return acc;
          }, {} as { [key: string]: { total: number, hourly: { [hour: string]: number } } });

          formattedData = Object.keys(aggregatedData).map(label => ({
            name: label,
            visiteurs: aggregatedData[label].total,
            hourly: aggregatedData[label].hourly,
          }));
        }

        setChartData(formattedData);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue";
        setError(errorMessage);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisitorData();
  }, [range, toast]);

  if (isLoading) {
    return (
      <div className="p-4 bg-card text-card-foreground rounded-lg shadow text-center">
        Chargement des statistiques...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive text-destructive-foreground rounded-lg shadow text-center">
        Erreur : {error}
      </div>
    );
  }

  return (
    <div className="p-4 bg-card text-card-foreground rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Statistiques des Visiteurs</h2>
        <div className="flex space-x-2">
            <Button variant={range === 'day' ? 'default' : 'outline'} onClick={() => setRange('day')}>Jour</Button>
            <Button variant={range === 'week' ? 'default' : 'outline'} onClick={() => setRange('week')}>Semaine</Button>
            <Button variant={range === 'month' ? 'default' : 'outline'} onClick={() => setRange('month')}>Mois</Button>
            <Button variant={range === 'year' ? 'default' : 'outline'} onClick={() => setRange('year')}>Année</Button>
        </div>
      </div>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="visiteurs" name="Visiteurs">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isPeak ? "hsl(var(--destructive))" : "#8884d8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-10">
          <p>Aucune donnée de visite disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default VisitorChart;
