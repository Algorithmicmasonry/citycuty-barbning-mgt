// app/admin/sales/page.tsx (Server Component)
import { SalesHistory } from "@/components/admin";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

async function getSalesData() {
  const services = await prisma.serviceRecord.findMany({
    include: {
      customer: true,
      recordedBy: {
        select: {
          email: true,
        },
      },
    },
    orderBy: {
      serviceDate: "desc",
    },
  });

  // Transform the data to match the component's expected format
  const salesData = services.map((service) => ({
    id: service.id,
    customer: service.customer.name,
    phone: service.customer.phone,
    service: service.serviceType,
    barber: service.barberName,
    amount: Number(service.amountPaid),
    paymentMethod: service.paymentMethod,
    date: format(new Date(service.serviceDate), "yyyy-MM-dd"),
    time: format(new Date(service.serviceDate), "h:mm a"),
    fullDate: service.serviceDate,
  }));

  return salesData;
}

const SalesPage = async () => {
  const salesData = await getSalesData();

  return <SalesHistory sales={salesData} />;
};

export default SalesPage;
