import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DataEntry, Tag } from '@/types/data';
import { loadEntries, loadTags } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Terminal, 
  Database, 
  Tags, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Archive,
  Zap,
  Globe,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const Dashboard = () => {
  const [entries, setEntries] = useState<DataEntry[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    setEntries(loadEntries());
    setTags(loadTags());
  }, []);

  const stats = useMemo(() => {
    const statusCounts = {
      active: entries.filter(e => e.status === 'active').length,
      pending: entries.filter(e => e.status === 'pending').length,
      completed: entries.filter(e => e.status === 'completed').length,
      archived: entries.filter(e => e.status === 'archived').length,
      error: entries.filter(e => e.status === 'error').length,
    };

    const priorityCounts = {
      high: entries.filter(e => e.priority === 'high').length,
      medium: entries.filter(e => e.priority === 'medium').length,
      low: entries.filter(e => e.priority === 'low').length,
    };

    const countryCounts = entries.reduce((acc, entry) => {
      const country = entry.country?.toUpperCase() || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { statusCounts, priorityCounts, topCountries };
  }, [entries]);

  // Vibrant, distinct colors for better readability
  const statusChartData = [
    { name: 'Active', value: stats.statusCounts.active, color: '#22c55e', icon: '⬤' },
    { name: 'Pending', value: stats.statusCounts.pending, color: '#eab308', icon: '◑' },
    { name: 'Completed', value: stats.statusCounts.completed, color: '#3b82f6', icon: '✔' },
    { name: 'Archived', value: stats.statusCounts.archived, color: '#6b7280', icon: '■' },
    { name: 'Error', value: stats.statusCounts.error, color: '#ef4444', icon: '✖' },
  ].filter(d => d.value > 0);

  const totalEntries = entries.length;

  const priorityChartData = [
    { name: 'High', value: stats.priorityCounts.high, fill: '#ef4444', icon: '▲' },
    { name: 'Medium', value: stats.priorityCounts.medium, fill: '#eab308', icon: '◆' },
    { name: 'Low', value: stats.priorityCounts.low, fill: '#22c55e', icon: '▼' },
  ];

  const countryChartData = stats.topCountries.map(([country, count]) => ({
    name: country,
    value: count,
  }));

  const recentEntries = useMemo(() => {
    return [...entries]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [entries]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Scanlines overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-50" />

      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 terminal-border bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary glow" />
              </div>
              <div className="font-mono">
                <h1 className="text-lg font-bold text-primary glow tracking-wider">
                  DASHBOARD<span className="animate-blink">_</span>
                </h1>
                <p className="text-xs text-muted-foreground">
                  <span className="text-accent">$</span> system overview
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="font-mono">
              <Link to="/">
                <Database className="h-4 w-4 mr-2" />
                Data Manager
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* ASCII art divider */}
        <div className="text-center text-muted-foreground/30 font-mono text-xs overflow-hidden select-none">
          ═══════════════════════════════════════════════════════════════════
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="terminal-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono text-primary glow">{entries.length}</p>
                  <p className="text-xs text-muted-foreground font-mono">Total Entries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="terminal-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded">
                  <Tags className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono text-accent">{tags.length}</p>
                  <p className="text-xs text-muted-foreground font-mono">Tags</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="terminal-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded">
                  <Activity className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono text-green-500">{stats.statusCounts.active}</p>
                  <p className="text-xs text-muted-foreground font-mono">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="terminal-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono text-destructive">{stats.priorityCounts.high}</p>
                  <p className="text-xs text-muted-foreground font-mono">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Status Distribution */}
          <Card className="terminal-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-primary flex items-center gap-2">
                <Zap className="h-4 w-4" />
                STATUS_DISTRIBUTION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {/* Pie Chart */}
                <div className="h-40 w-40 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={60}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="hsl(var(--background))"
                        strokeWidth={2}
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Legend with values and percentages */}
                <div className="flex flex-col justify-center gap-2 flex-1">
                  {statusChartData.map((entry) => {
                    const percentage = totalEntries > 0 ? Math.round((entry.value / totalEntries) * 100) : 0;
                    return (
                      <div key={entry.name} className="flex items-center justify-between text-xs font-mono gap-2">
                        <div className="flex items-center gap-2">
                          <span style={{ color: entry.color }}>{entry.icon}</span>
                          <span className="text-foreground">{entry.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{entry.value}</span>
                          <span style={{ color: entry.color }} className="font-bold min-w-[36px] text-right">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {statusChartData.length === 0 && (
                    <span className="text-muted-foreground text-xs">No data</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card className="terminal-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-primary flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                PRIORITY_LEVELS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priorityChartData.map((item) => {
                  const maxValue = Math.max(...priorityChartData.map(p => p.value), 1);
                  const percentage = totalEntries > 0 ? Math.round((item.value / totalEntries) * 100) : 0;
                  const barWidth = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                  
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span style={{ color: item.fill }}>{item.icon}</span>
                          <span className="text-foreground">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{item.value}</span>
                          <span style={{ color: item.fill }} className="font-bold min-w-[36px] text-right">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-3 bg-muted/30 rounded overflow-hidden">
                        <div 
                          className="h-full rounded transition-all duration-500"
                          style={{ 
                            width: `${barWidth}%`,
                            backgroundColor: item.fill 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                {priorityChartData.every(p => p.value === 0) && (
                  <span className="text-muted-foreground text-xs font-mono">No data</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Countries */}
          <Card className="terminal-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-primary flex items-center gap-2">
                <Globe className="h-4 w-4" />
                TOP_COUNTRIES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryChartData}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'monospace' }}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '4px',
                        fontFamily: 'monospace'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Breakdown & Recent Activity */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Status Breakdown */}
          <Card className="terminal-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-primary">STATUS_BREAKDOWN</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-mono">Active</span>
                </div>
                <span className="font-mono text-green-500">{stats.statusCounts.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-mono">Pending</span>
                </div>
                <span className="font-mono text-yellow-500">{stats.statusCounts.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-mono">Completed</span>
                </div>
                <span className="font-mono text-blue-500">{stats.statusCounts.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Archive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono">Archived</span>
                </div>
                <span className="font-mono text-muted-foreground">{stats.statusCounts.archived}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-mono">Error</span>
                </div>
                <span className="font-mono text-destructive">{stats.statusCounts.error}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="terminal-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-primary">RECENT_ACTIVITY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEntries.length === 0 ? (
                  <p className="text-sm text-muted-foreground font-mono">No entries yet</p>
                ) : (
                  recentEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <Terminal className="h-3 w-3 text-primary flex-shrink-0" />
                        <span className="font-mono truncate">{entry.machineId}</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono flex-shrink-0">
                        {new Date(entry.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground font-mono text-xs py-4">
          <span className="text-muted-foreground">[</span>
          EOF
          <span className="text-muted-foreground">]</span>
          {' '}• Dashboard v1.0 • 
          <span className="text-primary"> Connection: SECURE </span>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
