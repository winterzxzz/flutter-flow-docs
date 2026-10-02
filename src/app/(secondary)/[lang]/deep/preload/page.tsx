import { secondary } from "@/content/route";

const page = secondary("deep/preload");

export const generateMetadata = page.generateMetadata;
export default page.Page;
