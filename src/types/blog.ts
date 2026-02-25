import BlogSection from "./blog-section";

export default interface Blog {
    id: string;
    heroImage: string;
    publishDate: string;
    month: string;
    day: string;
    author: string;
    title: string;
    subtitle: string;
    sections: BlogSection[];
}
