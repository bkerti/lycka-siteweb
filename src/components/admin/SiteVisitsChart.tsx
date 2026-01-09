
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Function to generate simulated data
const generateSimulatedData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
      visites: Math.floor(Math.random() * (150 - 30 + 1)) + 30, // Random visits between 30 and 150
    });
  }
  return data;
};

const simulatedData = generateSimulatedData();

const SiteVisitsChart = () => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Visites du Site</CardTitle>
        <CardDescription>Évolution du nombre de visites sur les 30 derniers jours (données simulées).</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart
              data={simulatedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  borderColor: 'hsl(var(--border))' 
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="visites" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteVisitsChart;
