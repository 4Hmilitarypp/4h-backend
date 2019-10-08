import * as React from 'react'
import styled from 'styled-components/macro'
import { TSetModalState } from '../../components/table/useTable'
import { ILatestNews } from '../../sharedTypes'
import { hoveredRow } from '../../utils/mixins'

interface IProps {
  key: string
  article: ILatestNews
  setModalState: TSetModalState<ILatestNews>
}

const LatestNewsArticle: React.FC<IProps> = ({ article, setModalState }) => (
  <ArticleWrapper onClick={() => setModalState({ action: 'update', item: article })}>
    <Title>{article.title}</Title>
  </ArticleWrapper>
)

export default LatestNewsArticle

const ArticleWrapper = styled.div`
  padding: 2rem;
  position: relative;
  ${hoveredRow()};
  &:nth-child(2n - 1) {
    background: ${props => props.theme.white};
  }
`
const Title = styled.span`
  font-weight: 500;
`
