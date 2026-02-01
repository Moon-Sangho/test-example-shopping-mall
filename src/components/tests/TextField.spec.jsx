import { screen } from '@testing-library/react';
import React from 'react';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

// 1. Arrange - 테스트를 위한 환경 만들기
// -> className을 지닌 컴포넌트 렌더링
// 2. Act - 테스트할 동작 발생
// -> 렌더링에 대한 검증이기 때문에 이 단계는 생략
// -> 클릭이나 메서드 호출, prop 변경 등에 대한 작업이 여기에 해당
// 3. Assert - 올바른 동작이 실행되었는지 검증
// -> 렌더링 후 DOM에 해당 class가 존재하는지 검증
it('className prop으로 설정한 css class가 적용된다.', async () => {
  await render(<TextField className="my-class" />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  // 아래 코드를 통해 렌더링된 DOM을 확인할 수 있다.
  // screen.debug();

  expect(textInput).toHaveClass('my-class');
});

describe('placeholder prop 테스트', () => {
  it('기본 placeholder "텍스트를 입력해 주세요."가 노출된다.', async () => {
    await render(<TextField />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    expect(textInput).toBeInTheDocument();
  });

  it('placeholder prop에 따라 placeholder가 변경된다.', async () => {
    await render(<TextField placeholder="상품명을 입력해 주세요." />);

    const textInput = screen.getByPlaceholderText('상품명을 입력해 주세요.');

    expect(textInput).toBeInTheDocument();
  });
});

it('텍스트를 입력하면 onChange prop으로 등록한 함수가 호출된다.', async () => {
  // 스파이 함수
  // 테스트코드에서 특정 함수가 호출되었는지, 함수의 인자로 어떤 것이 넘어왔는지, 어떤 값을 반환하는지 등 다양한 값들을 저장
  const spy = vi.fn();

  const { user } = await render(<TextField onChange={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.type(textInput, 'test');

  expect(spy).toHaveBeenCalledWith('test');
});

it('엔터키를 입력하면 onEnter prop으로 등록한 함수가 호출된다.', async () => {
  const spy = vi.fn();

  const { user } = await render(<TextField onChange={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.type(textInput, 'test{Enter}');

  expect(spy).toHaveBeenCalledWith('test');
});

describe('포커스 테스트', () => {
  // 포커스 활성화 가능한 경우는 3가지 정도
  // 1. 탭 키로 인풋 요소로 포커스 이동
  // 2. 인풋 요소를 클릭했을 때 포커스 활성화
  // 3. textInput.focus() 메서드로 포커스 활성화
  it('포커스가 활성화되면 onFocus prop으로 등록한 함수가 호출된다.', async () => {
    const spy = vi.fn();

    const { user } = await render(<TextField onFocus={spy} />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    // click과 연관 -> 포커스, 마우스다운, 마우스업 등
    await user.click(textInput);

    expect(spy).toHaveBeenCalled();
  });

  it('포커스가 활성화되면 border 스타일이 추가된다.', async () => {
    const { user } = await render(<TextField />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    await user.click(textInput);

    expect(textInput).toHaveStyle({
      borderWidth: 2,
      borderColor: 'rgb(25, 118, 210)',
    });
  });
});
