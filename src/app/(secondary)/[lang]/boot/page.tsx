import { secondary } from "@/content/route";

const page = secondary("boot");

export const generateMetadata = page.generateMetadata;
export default page.Page;
