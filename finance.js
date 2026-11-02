(function(root) {
  'use strict';
  const TODAY = '2026-11-02';
  function totals(invoices) {
    const sum = fn => invoices.reduce((n, i) => n + fn(i), 0);
    const income = sum(i => i.type === 'income' ? i.net : 0);
    const costs = sum(i => i.type === 'expense' ? i.net : 0);
    const collected = sum(i => i.type === 'income' && i.paid ? i.net : 0);
    const paidCosts = sum(i => i.type === 'expense' && i.paid ? i.net : 0);
    const grossIncome = sum(i => i.type === 'income' ? i.net * (1 + i.vat / 100) : 0);
    const grossCosts = sum(i => i.type === 'expense' ? i.net * (1 + i.vat / 100) : 0);
    return {income,costs,collected,paidCosts,grossIncome,grossCosts,profit:income-costs,margin:income ? (income-costs)/income*100 : 0,receivable:income-collected,payable:costs-paidCosts};
  }
  function selectInvoices(data, year = 'all', project = 'all') {
    return data.invoices.filter(i => (year === 'all' || i.date.startsWith(String(year))) && (project === 'all' || i.project === project));
  }
  function status(invoice) { return invoice.paid ? 'paid' : invoice.due < TODAY ? 'overdue' : 'waiting'; }
  function projectStats(data,id) { const p=data.projects.find(p=>p.id===id); return {...totals(data.invoices.filter(i=>i.project===id)),contracted:p.budget,plannedCosts:data.contracts.filter(c=>c.project===id).reduce((n,c)=>n+c.amount,0)}; }
  function monthly(invoices,year) { return Array.from({length:12},(_,m)=>totals(invoices.filter(i=>i.date.startsWith(`${year}-${String(m+1).padStart(2,'0')}`)))); }
  const api={TODAY,totals,selectInvoices,status,projectStats,monthly};
  root.Finance=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
