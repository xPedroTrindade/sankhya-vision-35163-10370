import { Ticket, ChartData } from "@/types/ticket";

export const getModuleChartData = (tickets: Ticket[]): ChartData[] => {
  const moduleMap: { [key: string]: number } = {};
  
  tickets.forEach(ticket => {
    const module = ticket.modulo || 'Não definido';
    moduleMap[module] = (moduleMap[module] || 0) + 1;
  });

  return Object.entries(moduleMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({
      name,
      value
    }));
};

export const getTagsChartData = (tickets: Ticket[]): ChartData[] => {
  const tagMap: { [key: string]: number } = {};
  
  tickets.forEach(ticket => {
    if (ticket.tags && Array.isArray(ticket.tags)) {
      ticket.tags.forEach(tag => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    }
  });

  return Object.entries(tagMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({
      name,
      value
    }));
};

export const getEscalatedTicketsData = (tickets: Ticket[]): ChartData[] => {
  const escalated = tickets.filter(t => t.is_escalated).length;
  const nonEscalated = tickets.length - escalated;

  return [
    { name: 'Escalados', value: escalated },
    { name: 'Normais', value: nonEscalated }
  ];
};
