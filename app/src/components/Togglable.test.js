import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Togglable from './Togglable'
import i18n from '../i18n/index'

describe('<Togglable />', () => {
  const buttonLabel = 'show'
  let view

  beforeEach(() => {
    view = render(
      <Togglable buttonLabel={buttonLabel}>
        <div>testContent</div>
      </Togglable>
    )
  })

  test('renders its children', () => {
    view.getByText('testContent')
  })

  test('renders its children but they are not visible', () => {
    const el = view.getByText('testContent')
    expect(el.parentNode).toHaveStyle('display: none')
  })

  test('after clicking its children must be shown', () => {
    const button = view.getByText(buttonLabel)
    fireEvent.click(button)

    const el = view.getByText('testContent')
    expect(el.parentNode).not.toHaveStyle('display: none')

    const cancelButton = view.getByText(i18n.TOGGABLE.CANCEL_BUTTON)
    fireEvent.click(cancelButton)

    expect(el.parentNode).toHaveStyle('display: none')
  })
})
