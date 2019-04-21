import { RouteComponentProps } from '@reach/router'
import { format, subDays } from 'date-fns'
import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../../clientTypes'
import { Button, Heading, InputGroup, LeftSubHeading, P, SubHeading } from '../../components/Elements'
import useErrorHandler from '../../hooks/useErrorHandler'
import api from '../../utils/api'

const CloudinaryReports: React.FC<RouteComponentProps> = () => {
  const [report, setReport] = React.useState<any[]>()
  const handleError = useErrorHandler()

  const formatDate = (date: string | Date) => format(date, 'YYYY-MM-DD')

  const imagesByBandwidth = (positions: any[]) => {
    const startIndex = positions.findIndex(el => el.Position === 'Top Images by bandwidth (bytes)')
    const endIndex = positions.findIndex(el => el.Position === 'Top Images by requests')

    return positions.slice(startIndex, endIndex)
  }

  const resourcesByBandwidth = (positions: any[]) => {
    const startIndex = positions.findIndex(el => el.Position === 'Top Resources by bandwidth (bytes)')
    const endIndex = positions.findIndex(el => el.Position === 'Top Resources by requests')

    return positions.slice(startIndex, endIndex)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()

    const { beginDate, endDate } = e.currentTarget.elements

    api.admin
      .cloudinaryReports({
        beginDate: formatDate(beginDate.value),
        endDate: formatDate(endDate.value),
      })
      .then(setReport)
      .catch(handleError)
  }
  return (
    <CloudinaryReportsContainer>
      <Heading>Cloudinary Reports</Heading>
      <Form onSubmit={handleSubmit}>
        <SubHeading>Report Date Range</SubHeading>
        <DateInputs>
          <CustomInputGroup>
            <label htmlFor="beginDate">Begin Date</label>
            <input type="date" id="beginDate" defaultValue={formatDate(subDays(new Date(), 7))} />
          </CustomInputGroup>
          <CustomInputGroup>
            <label htmlFor="endDate">End Date</label>
            <input type="date" id="endDate" defaultValue={formatDate(new Date())} />
          </CustomInputGroup>
        </DateInputs>
        <Button>Get Report</Button>
      </Form>
      {report && (
        <Report>
          {imagesByBandwidth(report).map((image, index) =>
            index === 0 ? (
              <LeftSubHeading key={image.position + image.Label}>{image.Position}</LeftSubHeading>
            ) : (
              <P key={image.position + image.Label}>{JSON.stringify(image)}</P>
            )
          )}
          {resourcesByBandwidth(report).map((image, index) =>
            index === 0 ? (
              <LeftSubHeading key={image.position + image.Label}>{image.Position}</LeftSubHeading>
            ) : (
              <P key={image.position + image.Label}>{JSON.stringify(image)}</P>
            )
          )}
        </Report>
      )}
    </CloudinaryReportsContainer>
  )
}
export default CloudinaryReports

const CustomInputGroup = styled(InputGroup)`
  input,
  textarea {
    background: ${props => props.theme.white};
  }
  margin: 0 1.6rem;
`
const CloudinaryReportsContainer = styled.div`
  padding: 1rem;
`
const Form = styled.form`
  padding: 1.2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const DateInputs = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 2rem;
`
const Report = styled.div`
  padding: 2.4rem 4.8rem;
`
