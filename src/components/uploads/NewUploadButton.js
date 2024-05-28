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
import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useApi } from '../api'
import { useErrors } from '../errors'
import { getUrl } from '../nav/Routes'
import PropTypes from 'prop-types'

export default function NewUploadButton({...props}) {
  const {api} = useApi()
  const errors = useErrors()
  const history = useHistory()
  const location = useLocation()
  const [clicked, setClicked] = useState(false)
  const handleClick = () => {
    setClicked(true)
    api.post('/uploads')
      .then((upload) => {
        history.push(getUrl(`upload/id/${upload.upload_id}`, location))
      })
      .catch((error) => {
        setClicked(false)
        errors.raiseError(error)
      })
  }

  return <Button variant="contained" onClick={handleClick} disabled={clicked} {...props}>
    Create a new upload
  </Button>
}
NewUploadButton.propTypes = {
  isDisable: PropTypes.bool
}
