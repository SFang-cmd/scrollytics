import Layout from '@/components/Layout';
import KPICards from '@/components/KPICards';
import FollowerGrowthChart from '@/components/FollowerGrowthChart';
import EngagementChart from '@/components/EngagementChart';
import AccountsEngagedMetrics from '@/components/AccountsEngagedMetrics';

export default function Home() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* KPI Cards */}
        <section>
          <KPICards />
        </section>

        {/* Charts Section */}
        <section className="grid lg:grid-cols-2 gap-8">
          <FollowerGrowthChart />
          <EngagementChart />
        </section>

        {/* Accounts Engaged Section */}
        <section>
          <AccountsEngagedMetrics />
        </section>
      </div>
    </Layout>
  );
}
