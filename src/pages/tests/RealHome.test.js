import {render, screen, cleanup} from "@testing-library/react";
import RealHome from "../RealHome.js";
import {MemoryRouter} from "react-router-dom";
import Axios from 'axios'

afterEach(cleanup);

test('fetches and displays data ', () => {
    render(<MemoryRouter><RealHome /></MemoryRouter>);
    const elem = screen.getByTestId('todo-1')
    expect(elem).toHaveTextContent("Ispiti");
}); 