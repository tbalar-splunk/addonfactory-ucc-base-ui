import React, { Suspense, StrictMode } from 'react';
import layout from '@splunk/react-page';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { SplunkThemeProvider } from '@splunk/themes';
import { WaitSpinnerWrapper } from '../components/table/CustomTableStyle';

import { StyledContainer, ThemeProviderSettings } from './EntryPageStyle';
import { PAGE_CONF, PAGE_INPUT } from '../constants/pages';
import ConfigManager from '../util/configManager';
import messageDict from '../constants/messageDict';
import { getBuildDirPath, getRoutes } from '../util/script';
import './style.css';

// eslint-disable-next-line no-undef,camelcase
__webpack_public_path__ = `${getBuildDirPath()}/`;

const InputPage = React.lazy(() => import(/* webpackPrefetch: true */ './Input/InputPage'));
const ConfigurationPage = React.lazy(() =>
    import(/* webpackPrefetch: true */ './Configuration/ConfigurationPage')
);

// Take in a component as argument WrappedComponent
function higherOrderComponent(WrappedComponent) {
    // And return another component
    // eslint-disable-next-line react/prefer-stateless-function
    class HOC extends React.Component {
        render() {
            return (
                <SplunkThemeProvider // nosemgrep: typescript.react.best-practice.react-props-spreading.react-props-spreading
                    {...ThemeProviderSettings}
                >
                    <StyledContainer>
                        <ConfigManager>
                            {({ loading, appData }) => {
                                return (
                                    !loading &&
                                    appData && (
                                        <Suspense fallback={<WaitSpinnerWrapper />}>
                                            <WrappedComponent // nosemgrep: typescript.react.best-practice.react-props-spreading.react-props-spreading
                                                {...this.props}
                                            />
                                        </Suspense>
                                    )
                                );
                            }}
                        </ConfigManager>
                    </StyledContainer>
                </SplunkThemeProvider>
            );
        }
    }
    return HOC;
}

// Create a new component
const InputPageComponent = higherOrderComponent(InputPage);
const ConfigurationPageComponent = higherOrderComponent(ConfigurationPage);

const url = window.location.pathname;
console.log("url: ", url);
// const urlParts = url.substring(1).split('/');
// const page = urlParts[urlParts.length - 1];

// if (page === PAGE_INPUT) {
//     layout(<InputPageComponent />, { pageTitle: messageDict[116] });
// } else if (page === PAGE_CONF) {
//     layout(<Router><ConfigurationPageComponent /></Router>, { pageTitle: messageDict[117] });
// }


let routes = getRoutes().map((r) => {
    const path = "en-US/app/TA_vulns_scanner_add_on_for_splunk/" + r.name;
    const componentName = r.componentName == 'inputs' ? <InputPageComponent /> : <ConfigurationPageComponent />;
    // return r.componentName == 'inputs' ? <Route path={path} element={<InputPageComponent />} /> : <Route path={path} element={<ConfigurationPageComponent />} />;
    return <Route path={path} element={componentName} />;
});

console.log("routes1: ", routes)

layout(
    <StrictMode>
        <Router>
            <Routes>
                {routes}
            </Routes>
        </Router>
    </StrictMode>
)
