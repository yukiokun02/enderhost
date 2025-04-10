
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { AreaChart, Area } from "recharts";
import { format } from "date-fns";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

// Generate sample uptime data for the last 30 days
const generateUptimeData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Generate uptime percentage between 99.7% and 100%
    const uptime = 99.7 + (Math.random() * 0.3);
    
    data.push({
      date: date,
      value: uptime.toFixed(2),
      formatted: format(date, "MMM dd"),
    });
  }
  
  return data;
};

const UptimeStats = () => {
  const [uptimeData] = useState(generateUptimeData());
  
  // Calculate average uptime
  const averageUptime = uptimeData.reduce((sum, item) => sum + parseFloat(item.value), 0) / uptimeData.length;
  
  // Custom tooltip component for the line chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-white font-medium">{payload[0].payload.formatted}</p>
          <p className="text-minecraft-accent text-lg font-bold">{payload[0].value}% Uptime</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="py-24 bg-black" id="uptime">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="mb-3 inline-flex items-center justify-center gap-2 bg-minecraft-primary/10 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-minecraft-accent" />
            <span className="text-minecraft-accent text-sm font-medium">99.9% Guaranteed Uptime</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Server Status & Performance
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our servers maintain exceptional uptime and performance, ensuring your Minecraft world is always accessible
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 lg:col-span-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">30-Day Uptime History</h3>
              <div className="flex items-center gap-2 bg-minecraft-primary/20 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 text-minecraft-primary" />
                <span className="text-minecraft-accent text-sm font-medium">Live Data</span>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={uptimeData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5E42E3" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2E3BCC" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#222" strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="formatted" 
                    tick={{ fill: '#aaa' }} 
                    tickLine={{ stroke: '#444' }}
                    axisLine={{ stroke: '#444' }}
                  />
                  <YAxis 
                    domain={[99.5, 100.1]} 
                    tick={{ fill: '#aaa' }} 
                    tickLine={{ stroke: '#444' }}
                    axisLine={{ stroke: '#444' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#5E42E3" 
                    strokeWidth={3}
                    dot={{ fill: '#5E42E3', stroke: '#5E42E3', strokeWidth: 2, r: 4 }}
                    activeDot={{ fill: '#fff', stroke: '#5E42E3', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="col-span-1 grid grid-rows-2 gap-8">
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-hidden">
              <h3 className="text-xl font-bold text-white mb-3">Current Status</h3>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">All Systems Operational</span>
              </div>
              <div className="mt-4">
                <div className="text-xl font-bold text-gray-100 flex items-baseline gap-1">
                  <span>{averageUptime.toFixed(2)}%</span>
                  <span className="text-sm text-gray-400 font-normal">30 day avg</span>
                </div>
              </div>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-hidden">
              <h3 className="text-xl font-bold text-white mb-3">Quick Stats</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-300">Response time: 12ms</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-300">99.99% uptime SLA</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-300">24/7 monitoring</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UptimeStats;
