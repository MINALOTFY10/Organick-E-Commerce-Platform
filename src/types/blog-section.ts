export default interface BlogSection {
    id: string;
    type: "HEADING" | "PARAGRAPH" | "ORDERED_LIST" | "LIST" | "QUOTE";
    content: string | null;
    items?: string[];
    order: number;
}
