import { RouteComponentProps } from '@reach/router'
import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components'
import { InputGroup } from '../../components/Elements'
import Table from '../../components/table/Table'
import TableModal from '../../components/table/TableModal'
import useTable from '../../components/table/useTable'
import usePermission from '../../hooks/usePermission'
import { ILatestNews } from '../../sharedTypes'
import api from '../../utils/api'
import LatestNewsArticle from './LatestNewsArticle'
import LatestNewsForm from './LatestNewsForm'

const LatestNews: React.FC<RouteComponentProps> = () => {
  const { modalController, items: allLatestNews } = useTable<ILatestNews>('Latest News', api.latestNews)
  usePermission('admin')
  const [filterText, setFilterText] = React.useState<string>('')
  const isFound = (...args: string[]) => args.some(s => s.toLowerCase().includes(filterText))
  const filteredArticles = () =>
    allLatestNews
      .filter(latestNews => !filterText || isFound(latestNews.title))
      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
  return (
    <>
      <Table itemTitle="Article" itemTitlePlural="Latest News" modalController={modalController}>
        <CustomInputGroup color="white">
          <label>Article Filter</label>
          <input value={filterText} onChange={e => setFilterText(e.currentTarget.value.toLowerCase())} />
        </CustomInputGroup>
        {allLatestNews && (
          <div data-testid="Articles">
            {map(filteredArticles(), article => (
              <LatestNewsArticle key={article.title} article={article} setModalState={modalController.set} />
            ))}
          </div>
        )}
      </Table>
      <TableModal controller={modalController} itemTitle="News Item">
        <LatestNewsForm modalController={modalController} />
      </TableModal>
    </>
  )
}

export default LatestNews

const CustomInputGroup = styled(InputGroup)`
  margin: 0 2.4rem 2rem;
`
