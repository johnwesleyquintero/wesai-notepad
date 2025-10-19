import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SearchBar } from "../SearchBar";

describe("SearchBar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the search input", () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByPlaceholderText("Search notes...")).toBeInTheDocument();
  });

  it("calls onSearch with the query after a debounce", () => {
    const handleSearch = jest.fn();
    render(<SearchBar onSearch={handleSearch} />);

    const searchInput = screen.getByPlaceholderText("Search notes...");
    fireEvent.change(searchInput, { target: { value: "test" } });

    expect(handleSearch).not.toHaveBeenCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(handleSearch).toHaveBeenCalledWith("test");
  });

  it("updates the input value when typing", () => {
    render(<SearchBar onSearch={() => {}} />);
    const searchInput = screen.getByPlaceholderText(
      "Search notes...",
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "hello" } });
    expect(searchInput.value).toBe("hello");
  });
});
