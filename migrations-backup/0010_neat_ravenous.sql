DROP VIEW `estimate_totals`;--> statement-breakpoint
CREATE VIEW `estimate_totals` AS 
  select date,id,coalesce(l.labor,0) as labor,
    coalesce(p.parts,0) as parts, 
    coalesce(o.oil,0) as oil,
    coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0) as subtotal,
    round(0.081*(coalesce(p.parts,0)+coalesce(o.oil,0)),2) as tax,
    if(coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0) >500,15,
    round(0.03*(coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0)),2))as shop_fees,
    coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0)+
    round(0.081*(coalesce(p.parts,0)+coalesce(o.oil,0)),2)+
    if(coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0) >500,15,
    round(0.03*(coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0)),2)) as total,
    coalesce(p.p_cost,0) + coalesce(o.o_cost,0) as cost,
    coalesce(p.parts,0) - coalesce(p.p_cost,0) as parts_margin,
    coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0)+
    round(0.081*(coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0)),2)+
    if(coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0) >500,15,
    round(0.03*(coalesce(l.labor,0)+coalesce(p.parts,0)+coalesce(o.oil,0)),2)) -
    coalesce(p.p_cost,0) + coalesce(o.o_cost,0) as margin 
from estimates r
left join (
    select estimate_id,coalesce(sum(price),0) as labor
            from labor
        group by estimate_id) l
on l.estimate_id=r.id
left join (
    select estimate_id,coalesce(sum(unit_price*quantity),0) as parts,
    coalesce(sum(cost*quantity),0) as p_cost
            from parts 
        group by estimate_id) p 
on p.estimate_id=r.id 
left join (
    select estimate_id,coalesce(sum(price_per_unit*quantity),0) as oil,
    coalesce(sum(cost*quantity),0) as o_cost
            from oil 
        group by estimate_id) o 
on o.estimate_id=r.id;
  ;