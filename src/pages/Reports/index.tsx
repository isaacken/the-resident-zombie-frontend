import React, { useEffect } from 'react';
import { 
  RadialChart, 
  XYPlot,
  VerticalBarSeries,
  DiscreteColorLegend
} from 'react-vis';
import api from '../../services/api';

import Header from '../../components/Header';

import './styles.css';

interface PeopleInventoryReport {
  average_items_quantity_per_person: number;
  average_items_quantity_per_healthy_person: number;
  average_quantity_of_each_item_per_person: {
    "AK47": number;
    "Fiji Water": number;
    "First Aid Pouch": number;
    "Campbell Soup": number;
  }
}

function Reports() { 
  const baseInventory = {
    average_items_quantity_per_person: 0,
    average_items_quantity_per_healthy_person: 0,
    average_quantity_of_each_item_per_person: {
      "AK47": 0,
      "Fiji Water": 0,
      "First Aid Pouch": 0,
      "Campbell Soup": 0
    }
  };

  const [infected, setInfected] = React.useState(0);
  const [peopleInventory, setPeopleInventory] = React.useState<PeopleInventoryReport>(baseInventory);
  const [pointsLost, setPointsLost] = React.useState(0);

  useEffect(() => {
    async function getInfectedReport() {
      const response = await api.get('api/report/infected.json');
      setInfected(response.data.report.average_infected);
    }

    async function getPeopleInventoryReport() {
      const response = await api.get('api/report/people_inventory.json');
      setPeopleInventory(response.data.report);
    }

    async function getPointsLost() {
      const response = await api.get('api/report/infected_points.json');
      setPointsLost(response.data.report.total_points_lost);
    }
  
    getInfectedReport();
    getPeopleInventoryReport();
    getPointsLost();
  }, []);

  return (
    <div id="reports" className="container">
      <Header>Reports</Header>
      <section className="reports">
        <article className="report">
          <h2>Infections report</h2>
          <p className="report-description">Average of infected and non-infected people</p>
          <RadialChart
            data={[
              { angle: infected, label: `Infected (${(infected * 100).toFixed(1)}%)`, color: "#B53E38" },
              { angle: 1 - infected, label: `Healthy (${((1 - infected) * 100).toFixed(1)}%)`, color: "#265259" }
            ]}
            colorType="literal"
            height={200}
            width={200}
            showLabels={true}
            labelsStyle={{
              fontSize: 15,
              fill: "#F0DEC1",
              fontWeight: "bold",
              textShadow: "0.2rem 0.2rem 0.1rem var(--color-button-shadow)"
            }}
            radius={100}
            innerRadius={60}
            labelsRadiusMultiplier={0.9}
            className="infections-report-chart"
          />
        </article>
        <article className="report">
          <h2>Points lost by infected people</h2>
          <p className="report-description">Total points lost in items that belong to infected people</p>
          <div className="lost-points">
            <span className="points">$ </span>{pointsLost}
          </div>
        </article>
        <article className="report people-inventory-report">
          <h2>People inventory report</h2>
          <p className="report-description">
            Average of the quantity of items per person 
            (total and just non-infected) and of each item
          </p>
          
          <div className="chart-container">
            <XYPlot 
              height={250} 
              width={250}
              className="people-inventory-report-chart"
            >
              <VerticalBarSeries
                colorType="literal"
                barWidth={0.75}
                data={[
                  { x: 0, y: peopleInventory.average_items_quantity_per_person, color: "#6F8B71", label: "" },
                  { x: 1, y: peopleInventory.average_items_quantity_per_healthy_person, color: "#5C735D" },
                  { x: 3, y: peopleInventory.average_quantity_of_each_item_per_person["AK47"], color: "#265259" },
                  { x: 4, y: peopleInventory.average_quantity_of_each_item_per_person["Campbell Soup"], color: "#21474D" },
                  { x: 5, y: peopleInventory.average_quantity_of_each_item_per_person["Fiji Water"], color: "#1C3C41" },
                  { x: 6, y: peopleInventory.average_quantity_of_each_item_per_person["First Aid Pouch"], color: "162F33" },
                ]}
              />
            </XYPlot>
            <DiscreteColorLegend 
              className="people-inventory-report-legend"
              items={[
                { title: ` Items per person: ${peopleInventory.average_items_quantity_per_person.toFixed(1)}`, color: "#6F8B71" },
                { title: ` Items per healthy person: ${peopleInventory.average_items_quantity_per_healthy_person.toFixed(1)}`, color: "#5C735D" },
                { title: ` `, color: "rgba(0,0,0,0)" },
                { title: ` AK47: ${peopleInventory.average_quantity_of_each_item_per_person["AK47"].toFixed(1)}`, color: "#265259" },
                { title: ` Campbell Soup: ${peopleInventory.average_quantity_of_each_item_per_person["Campbell Soup"].toFixed(1)}`, color: "#21474D" },
                { title: ` Fiji Water: ${peopleInventory.average_quantity_of_each_item_per_person["Fiji Water"].toFixed(1)}`, color: "#1C3C41" },
                { title: ` First Aid Pouch: ${peopleInventory.average_quantity_of_each_item_per_person["First Aid Pouch"].toFixed(1)}`, color: "#162F33" }
              ]} 
            />
          </div>
        </article>
      </section>
    </div>
  );
}

export default Reports;