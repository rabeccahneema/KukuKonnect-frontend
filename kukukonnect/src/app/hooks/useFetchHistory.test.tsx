import { renderHook, act, waitFor } from "@testing-library/react";
import useFetchHistory, { HistoryType } from "./useFetchHistory";
import { fetchHistory } from "../utils/fetchHistory";

jest.mock("../utils/fetchHistory", () => ({
    fetchHistory: jest.fn(),
}));


describe("useFetchHistory", () => {
    const mockData: HistoryType[] = [
        { temperature: "22", humidity: "60", timestamp: "2025-09-22T00:00:00.000Z" },
        { temperature: "23", humidity: "62", timestamp: "2025-09-23T00:00:00.000Z" },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns history data on success", async () => {
        (fetchHistory as jest.Mock).mockResolvedValueOnce(mockData);

        const { result } = renderHook(() => useFetchHistory());

        await act(async () => { });

        expect(fetchHistory).toHaveBeenCalled();
        expect(result.current.history).toEqual(mockData);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it("returns error if fetch fails", async () => {
        (fetchHistory as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

        const { result } = renderHook(() => useFetchHistory());

        await act(async () => { });

        expect(fetchHistory).toHaveBeenCalled();
        expect(result.current.history).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe("Network error");
    });

    it("initial state is loading", () => {
        (fetchHistory as jest.Mock).mockImplementation(() => new Promise(() => { }));
        const { result } = renderHook(() => useFetchHistory());
        expect(result.current.loading).toBe(true);
        expect(result.current.history).toEqual([]);
        expect(result.current.error).toBeNull();
    });

    it("should handle empty response", async () => {
        (fetchHistory as jest.Mock).mockResolvedValueOnce([]);
        const { result } = renderHook(() => useFetchHistory());
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.history).toEqual([]);
        expect(result.current.error).toBeNull();
    });
});


