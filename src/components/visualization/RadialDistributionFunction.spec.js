/*
 * Copyright The NOMAD Authors.
 *
 * This file is part of NOMAD. See https://nomad-lab.eu for further info.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react'
import { renderNoAPI } from '../conftest.spec'
import { expectPlot, VisualizationState } from './conftest.spec'
import RadialDistributionFunction, { rdfError } from './RadialDistributionFunction'

test.each([
  ['no data', VisualizationState.NoData, {molecular: {'MOL-MOL': false}}, undefined],
  ['loading', VisualizationState.Loading, {molecular: {'MOL-MOL': undefined}}, 'radial-distribution-function-molecular-mol-mol-placeholder'],
  ['error: data cannot be false', VisualizationState.Error, false, undefined],
  ['error: data cannot be undefined', VisualizationState.Error, undefined, undefined],
  ['error: invalid data layout', VisualizationState.Error, {invalid: "data"}, undefined],
  ['valid', VisualizationState.Success, {molecular: {'MOL-MOL': [{bins: [0, 1], value: [0, 1]}]}}, undefined]
])('rdf plot: %s', async (id, state, data, placeholderTestID) => {
  renderNoAPI(<RadialDistributionFunction rdf={data} />)
  await expectPlot(state, placeholderTestID, rdfError)
})
