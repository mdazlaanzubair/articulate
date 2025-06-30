import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { providerGuides } from "./data";

interface ProviderInterface {
  provider: "gemini" | "openai"; // Extendable with more providers
}

// Interface for the complete guide data for a provider
interface ProviderGuideDataInterface {
  meta_data: {
    title: string;
    desc: string;
    video: {
      title: string;
      url: string;
    };
    official_docs: {
      label: string;
      url: string;
    };
  };
  steps: {
    title: string;
    content: string;
  }[];
}

export const TabContent = (props: ProviderInterface) => {
  const guideData: ProviderGuideDataInterface = providerGuides[props.provider];

  return (
    <Accordion defaultValue="video" type="single" collapsible>
      <div className="bg-gradient-to-tr from-primary to-primary/80 dark:from-primary-foreground dark:to-primary-foreground/80 p-6 rounded-xl text-white">
        <h1 className="text-xl font-extrabold text-center drop-shadow-md text-primary-foreground dark:text-primary">
          {guideData.meta_data.title}
        </h1>
        <p className="text-opacity-90 mt-2 text-center text-sm text-primary-foreground/75 dark:text-primary/75">
          {guideData.meta_data.desc}
        </p>

        <Button asChild variant="link" className="w-full text-primary-foreground dark:text-primary underline font-semibold mt-3">
          <a
            href={guideData.meta_data.official_docs.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {guideData.meta_data.official_docs.label}
          </a>
        </Button>
      </div>
      <AccordionItem value="video">
        <AccordionTrigger className="text-xl font-semibold hover:no-underline cursor-pointer">
          Video Tutorial
        </AccordionTrigger>
        <AccordionContent>
          <div className="aspect-video w-full rounded-lg overflow-hidden shadow border border-gray-200 dark:border-gray-700">
            <iframe
              className="w-full h-full"
              src={guideData.meta_data.video.url}
              title={guideData.meta_data.video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="docs">
        <AccordionTrigger className="text-xl font-semibold hover:no-underline cursor-pointer">
          Step-by-Step Documentation
        </AccordionTrigger>
        <AccordionContent className="pb-0">
          {/* Step-by-Step Documentation Guide */}
          <ul className="list-disc [&>li]:mt-2">
            {guideData.steps.map((step, index) => (
              <li className="flex flex-col" key={`step-${index}`}>
                <h4 className="text-sm font-bold tracking-tight mb-0">
                  {`Step ${index + 1} - ${step.title}`}
                </h4>
                <p className="text-xs text-primary/75">{step.content}</p>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
