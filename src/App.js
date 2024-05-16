import { BrowserRouter, Route, Routes } from "react-router-dom";
import getConfig from "./config";

const config = getConfig();

function App() {
  const { title, routes, wrapper: Wrapper } = config;

  return (
    <Wrapper>
      <BrowserRouter>
        <div className="App">
          <div>{title}</div>

          <Routes>
            {routes.map(({ path, exact, component: Component }, index) => (
              <Route
                key={index}
                path={path}
                exact={exact}
                element={<Component />}
              />
            ))}
          </Routes>
        </div>
      </BrowserRouter>
    </Wrapper>
  );
}

export default App;
