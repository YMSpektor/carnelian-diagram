import { Context } from "..";

export function useContext<T>(context: Context<T>): T {
    return context.consume();
}