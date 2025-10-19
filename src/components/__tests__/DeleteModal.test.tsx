import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DeleteModal } from "../DeleteModal";

describe("DeleteModal", () => {
  it("renders the modal when isOpen is true", () => {
    render(
      <DeleteModal
        isOpen={true}
        noteTitle="Test Note"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.getByText("Delete Note?")).toBeInTheDocument();
  });

  it("does not render the modal when isOpen is false", () => {
    render(
      <DeleteModal
        isOpen={false}
        noteTitle="Test Note"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.queryByText("Delete Note?")).not.toBeInTheDocument();
  });

  it("calls onConfirm when the delete button is clicked", () => {
    const handleConfirm = jest.fn();
    render(
      <DeleteModal
        isOpen={true}
        noteTitle="Test Note"
        onConfirm={handleConfirm}
        onCancel={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("Delete"));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when the cancel button is clicked", () => {
    const handleCancel = jest.fn();
    render(
      <DeleteModal
        isOpen={true}
        noteTitle="Test Note"
        onConfirm={() => {}}
        onCancel={handleCancel}
      />,
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('displays "Untitled" if noteTitle is empty', () => {
    render(
      <DeleteModal
        isOpen={true}
        noteTitle=""
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.getByText("Untitled")).toBeInTheDocument();
  });
});
