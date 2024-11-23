import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Home, Users, Award } from "lucide-react";
import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">
          About Pinnacle Properties
        </h1>
        <p className="text-xl text-muted-foreground">
          Your Trusted Partner in Real Estate Excellence
        </p>
      </header>

      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Founded in 2005, Pinnacle Properties has grown from a small local
              agency to a leading force in the real estate market. With over 15
              years of experience, we've helped thousands of clients find their
              dream homes and make smart property investments.
            </p>
            <Button>Learn More</Button>
          </div>
          <div className="relative h-64 md:h-auto">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Pinnacle Properties Office"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">Our Mission</h2>
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <p className="text-lg text-center">
              "To provide unparalleled real estate services, guiding our clients
              through every step of their property journey with integrity,
              expertise, and a commitment to excellence."
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Meet Our Team
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Jane Doe",
              role: "Founder & CEO",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "John Smith",
              role: "Senior Real Estate Agent",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "Emily Brown",
              role: "Property Manager",
              image: "/placeholder.svg?height=300&width=300",
            },
          ].map((member) => (
            <Card key={member.name}>
              <CardContent className="p-6 text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Why Choose Pinnacle Properties?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Building,
              title: "Extensive Portfolio",
              description:
                "Wide range of properties to suit every need and budget",
            },
            {
              icon: Users,
              title: "Expert Team",
              description:
                "Experienced professionals dedicated to your success",
            },
            {
              icon: Home,
              title: "Personalized Service",
              description: "Tailored approach to meet your unique requirements",
            },
            {
              icon: Award,
              title: "Proven Track Record",
              description:
                "Consistently recognized for our outstanding performance",
            },
          ].map((feature) => (
            <Card key={feature.title}>
              <CardContent className="p-6 text-center">
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
