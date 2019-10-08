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

const LatestNewsArticles: React.FC<RouteComponentProps> = () => {
  const { modalController, items: articles } = useTable<ILatestNews>('Article', api.latestNews)
  console.log(articles)
  usePermission('admin')
  const [filterText, setFilterText] = React.useState<string>('')
  const isFound = (...args: string[]) => args.some(s => s.toLowerCase().includes(filterText))
  const filteredArticles = () => articles.filter(article => !filterText || isFound(article.title))

  return (
    <>
      <Table itemTitle="Article" itemTitlePlural="Articles" modalController={modalController}>
        <CustomInputGroup color="white">
          <label>Article Filter</label>
          <input value={filterText} onChange={e => setFilterText(e.currentTarget.value.toLowerCase())} />
        </CustomInputGroup>
        {articles && (
          <div data-testid="Articles">
            {map(filteredArticles(), article => (
              <LatestNewsArticle key={article.id} article={article} setModalState={modalController.set} />
            ))}
          </div>
        )}
      </Table>
      <TableModal controller={modalController} itemTitle="Article">
        <LatestNewsForm modalController={modalController} />
      </TableModal>
    </>
  )
}

export default LatestNewsArticles

const CustomInputGroup = styled(InputGroup)`
  margin: 0 2.4rem 2rem;
`
