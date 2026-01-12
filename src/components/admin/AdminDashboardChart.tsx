import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps, Cell } from 'recharts';
import { Button } from "@/components/ui/button";

// Updated interface to reflect API changes
interface VisitData {
  date?: string;
  hour?: number;
  count: string;
}

// Chart data structure remains the same
interface ChartData {
  name: string; 
  visits: number;
  hourly?: { [hour: string]: number };
  isPeak?: boolean;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartData;
    return (
      <div className="p-4 bg-background/90 backdrop-blur-sm shadow-lg rounded-lg border border-border">
        <p className="label text-lg font-bold text-foreground">{`Date : ${label}`}</p>
        <p className="intro text-primary">{`Visites : ${payload[0].value}`}</p>
        {data.hourly && Object.keys(data.hourly).length > 0 && (
          <div className="mt-2">
            <p className="font-semibold">Détail par heure :</p>
            <ul className="list-disc pl-4">
              {Object.entries(data.hourly).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([hour, count]) => (
                <li key={hour}>{`${hour.padStart(2, '0')}h : ${count} visiteur(s)`}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return null;
};

const AdminDashboardChart = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState('month'); // day, week, month, year

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('adminToken');

      try {
        const response = await fetch(`/api/analytics/visits-summary?range=${range}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("Accès non autorisé. Veuillez vous assurer que vous êtes connecté avec un compte administrateur.");
          }
          throw new Error(`Erreur lors de la récupération des données: ${response.statusText}`);
        }

        const result: VisitData[] = await response.json();
        
        let formattedData: ChartData[] = [];

        if (range === 'day') {
          let peakHour = -1;
          let maxVisits = -1;

          const hourlyData = result.map(item => {
            const visits = parseInt(item.count, 10);
            if (visits > maxVisits) {
              maxVisits = visits;
              peakHour = item.hour!;
            }
            return {
              name: `${String(item.hour).padStart(2, '0')}:00`,
              visits: visits,
            };
          });
          
          // Ensure all hours are present
          const allHoursData: ChartData[] = [];
          for (let i = 0; i < 24; i++) {
            const hourData = hourlyData.find(d => parseInt(d.name.split(':')[0]) === i);
            const isPeak = i === peakHour;
            if (hourData) {
              allHoursData.push({ ...hourData, isPeak });
            } else {
              allHoursData.push({ name: `${String(i).padStart(2, '0')}:00`, visits: 0, isPeak });
            }
          }
          formattedData = allHoursData;

        } else if (range === 'week') {
            const aggregatedData = result.reduce((acc, item) => {
                const dateObj = new Date(item.date!);
                const dateLabel = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
                
                if (!acc[dateLabel]) {
                    acc[dateLabel] = { total: 0, hourly: {} };
                }
                
                const visits = parseInt(item.count, 10);
                acc[dateLabel].total += visits;
                
                const hour = String(item.hour!);
                if (!acc[dateLabel].hourly[hour]) {
                    acc[dateLabel].hourly[hour] = 0;
                }
                acc[dateLabel].hourly[hour] += visits;

                return acc;
            }, {} as { [key: string]: { total: number, hourly: { [hour: string]: number } } });

            formattedData = Object.keys(aggregatedData).map(label => ({
                name: label,
                visits: aggregatedData[label].total,
                hourly: aggregatedData[label].hourly,
            }));

        } else { // 'month' and 'year'
          const aggregatedData = result.reduce((acc, item) => {
            const dateObj = new Date(item.date!);
            let dateLabel = '';
            if (range === 'month') {
              dateLabel = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
            } else if (range === 'year') {
              dateLabel = dateObj.toLocaleString('fr-FR', { month: 'long' });
            }

            if (!acc[dateLabel]) {
              acc[dateLabel] = { total: 0 };
            }
            acc[dateLabel].total += parseInt(item.count, 10);
            return acc;
          }, {} as { [key: string]: { total: number } });

          formattedData = Object.keys(aggregatedData).map(label => ({
            name: label,
            visits: aggregatedData[label].total,
          }));
        }

        setData(formattedData);

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><p>Chargement des données du tableau de bord...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500"><p>{error}</p></div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord analytique</h1>
      
      <div className="bg-card p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Visites du site</h2>
          <div className="flex space-x-2">
            <Button variant={range === 'day' ? 'default' : 'outline'} onClick={() => setRange('day')}>Jour</Button>
            <Button variant={range === 'week' ? 'default' : 'outline'} onClick={() => setRange('week')}>Semaine</Button>
            <Button variant={range === 'month' ? 'default' : 'outline'} onClick={() => setRange('month')}>Mois</Button>
            <Button variant={range === 'year' ? 'default' : 'outline'} onClick={() => setRange('year')}>Année</Button>
          </div>
        </div>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{
                top: 10, right: 30, left: 0, bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--accent))' }}
                content={<CustomTooltip />}
              />
              <Bar dataKey="visits" name="Visites" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isPeak ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-semibold mb-2">Le graphique des visites est actuellement vide.</h3>
            <p className="text-muted-foreground">
              C'est tout à fait normal si le suivi vient de commencer. Pour générer des données :
            </p>
            <ul className="list-decimal list-inside text-muted-foreground mt-2">
              <li>Naviguez sur quelques pages du site (Accueil, Services, Projets...).</li>
              <li>Revenez sur cette page.</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Les données de visites apparaîtront ici.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardChart;