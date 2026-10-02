import { secondary } from "@/content/route";

const page = secondary("lessons");

export const generateMetadata = page.generateMetadata;
export default page.Page;
