import { RouteComponentProps } from '@reach/router'
import { format, subDays } from 'date-fns'
import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../../clientTypes'
import { Button, Heading, InputGroup, LeftSubHeading, Section, SubHeading } from '../../components/Elements'
import useErrorHandler from '../../hooks/useErrorHandler'
import api from '../../utils/api'
import { elevation } from '../../utils/mixins'

const CloudinaryReports: React.FC<RouteComponentProps> = () => {
  const [report, setReport] = React.useState<any[]>()
  const [usage, setUsage] = React.useState<any>()
  const handleError = useErrorHandler()

  React.useEffect(() => {
    api.admin
      .cloudinaryUsage()
      .then(setUsage)
      .catch(handleError)
  }, []) // eslint-disable-line

  const formatDate = (date: string | Date) => format(date as any, 'YYYY-MM-DD')

  const formatMB = (val: any) =>
    (val / 1000)
      .toFixed(0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  const imagesByBandwidth = (lines: any[]) => {
    const startIndex = lines.findIndex(el => el.Position === 'Top Images by bandwidth (bytes)')

    return { lines: lines.slice(startIndex + 1, startIndex + 10), header: lines[startIndex].Position }
  }

  const resourcesByBandwidth = (lines: any[]) => {
    const startIndex = lines.findIndex(el => el.Position === 'Top Resources by bandwidth (bytes)')
    return { lines: lines.slice(startIndex + 1, startIndex + 10), header: lines[startIndex].Position }
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
      {usage && (
        <Section>
          <LeftSubHeading>Cloudinary Usage</LeftSubHeading>
          <UsageData>
            <b>Objects: </b>
            <span>
              Usage: <BoldData>{usage.objects.usage}</BoldData>
            </span>
          </UsageData>
          <UsageData>
            <b>Transformations: </b>
            <span>
              Usage: <BoldData>{usage.transformations.usage}</BoldData> items
            </span>
            <span>
              Used Credits: <BoldData>{usage.transformations.credits_usage}</BoldData> Credits
            </span>
          </UsageData>
          <UsageData>
            <b>Bandwidth: </b>
            <span>
              Usage: <BoldData>{formatMB(usage.bandwidth.usage)}</BoldData> MB
            </span>
            <span>
              Used Credits: <BoldData>{usage.bandwidth.credits_usage}</BoldData> Credits
            </span>
          </UsageData>
          <UsageData>
            <b>Storage: </b>
            <span>
              Usage: <BoldData>{formatMB(usage.storage.usage)}</BoldData> MB
            </span>
            <span>
              Used Credits: <BoldData>{usage.storage.credits_usage}</BoldData> Credits
            </span>
          </UsageData>
          <UsageData>
            <b>Credits: </b>
            <span>
              Usage: <BoldData>{usage.credits.usage}</BoldData> Credits
            </span>
            <span>
              Used Percent: <BoldData>{usage.credits.used_percent}</BoldData>%
            </span>
            <span>
              Limit: <BoldData>{usage.credits.limit}</BoldData>
            </span>
          </UsageData>
        </Section>
      )}
      <Section>
        <Form onSubmit={handleSubmit}>
          <SubHeading>Report Date Range</SubHeading>
          <DateInputs>
            <DateInputGroup>
              <label htmlFor="beginDate">Begin Date</label>
              <input type="date" id="beginDate" defaultValue={formatDate(subDays(new Date(), 7))} />
            </DateInputGroup>
            <DateInputGroup>
              <label htmlFor="endDate">End Date</label>
              <input type="date" id="endDate" defaultValue={formatDate(new Date())} />
            </DateInputGroup>
          </DateInputs>
          <Button>Get Report</Button>
        </Form>
      </Section>
      {report && (
        <Report>
          <ReportSection>
            <LeftSubHeading>{imagesByBandwidth(report).header}</LeftSubHeading>
            <ReportData>
              <ReportDataHeading>Url</ReportDataHeading>
              <ReportDataHeading>Bandwidth</ReportDataHeading>
              <ReportDataHeading>Percent</ReportDataHeading>
            </ReportData>
            {imagesByBandwidth(report).lines.map(line => (
              <ReportData key={line.Position + line.Label}>
                <ReportDataValue>{line.Label}</ReportDataValue>
                <ReportDataValue>
                  <BoldData>{formatMB(line.Value)}</BoldData> MB
                </ReportDataValue>
                <ReportDataValue>
                  <BoldData>{line.Percents} </BoldData>
                </ReportDataValue>
              </ReportData>
            ))}
          </ReportSection>
          <ReportSection>
            <LeftSubHeading>{resourcesByBandwidth(report).header}</LeftSubHeading>
            <ReportData>
              <ReportDataHeading>Url</ReportDataHeading>
              <ReportDataHeading>Bandwidth</ReportDataHeading>
              <ReportDataHeading>Percent</ReportDataHeading>
            </ReportData>
            {resourcesByBandwidth(report).lines.map(line => (
              <ReportData key={line.Position + line.Label}>
                <ReportDataValue>{line.Label}</ReportDataValue>
                <ReportDataValue>
                  <BoldData>{formatMB(line.Value)}</BoldData> MB
                </ReportDataValue>
                <ReportDataValue>
                  <BoldData>{line.Percents} </BoldData>
                </ReportDataValue>
              </ReportData>
            ))}
          </ReportSection>
        </Report>
      )}
    </CloudinaryReportsContainer>
  )
}
export default CloudinaryReports

const CloudinaryReportsContainer = styled.div`
  padding: 0 3.6rem;
`
const UsageData = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`
const BoldData = styled.span`
  font-weight: 500;
`
const Form = styled.form`
  margin-top: 2.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const DateInputGroup = styled(InputGroup)`
  input,
  textarea {
    background: ${props => props.theme.white};
  }
  margin: 0 1.6rem;
`
const DateInputs = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 2rem;
`
const Report = styled.div`
  margin: 3.6rem;
  padding: 2.4rem 4.8rem;
  background: ${props => props.theme.white};
  ${elevation(4)}
`
const ReportSection = styled.div``
const ReportData = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
  padding: 1.2rem 2rem;
  background: ${props => props.theme.primaryLight};

  &:nth-child(2n - 1) {
    background: ${props => props.theme.white};
  }
`
const ReportDataHeading = styled.span`
  font-weight: 600;
  padding: 0 1.2rem;
`
const ReportDataValue = styled.span`
  white-space: pre-wrap;
  word-break: break-all;
  padding: 0 1.2rem;
`
