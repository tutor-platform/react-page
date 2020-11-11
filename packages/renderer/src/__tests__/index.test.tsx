import {
  ContentPluginProps,
  EditableType,
  LayoutPluginProps,
  Plugins,
} from '@react-page/core';
import slate from '@react-page/plugins-slate';
import { mount, render } from 'enzyme';
import * as React from 'react';
import { HTMLRenderer } from '../index';

jest.mock('react', () => {
  const r = jest.requireActual('react');

  return { ...r, memo: (x) => x };
});

const Layout = ({ children, state: { className } }) => (
  <div className={`${className}`}>{children}</div>
);

const plugins: Plugins = {
  content: [(slate() as unknown) as ContentPluginProps],
  layout: [
    ({
      name: 'layout',
      version: '0.0.1',
      Component: Layout,
    } as unknown) as LayoutPluginProps,
  ],
};

describe('HTMLRenderer', () => {
  // describe('single content cell', () => {
  //   const state = {
  //     id: '1',
  //     cells: [{
  //       id: '2',
  //       content: {
  //         plugin: {
  //           name: 'ory/editor/core/default'
  //         },
  //         state: {
  //           value: 'Lorem ipsum dolor sit amet.'
  //         }
  //       }
  //     }]
  //   }
  //
  //   it('should render "lorem ipsum"', () => {
  //     const wrapper = mount(<HTMLRenderer state={state} plugins={plugins}/>)
  //     expect(wrapper.text()).toContain('Lorem ipsum')
  //   })
  // })
  //
  // describe('layout > content cell', () => {
  //   const state = {
  //     id: '1',
  //     cells: [{
  //       id: '2',
  //       layout: {
  //         plugin: {
  //           name: 'layout'
  //         },
  //         state: {
  //           className: 'layout-state'
  //         }
  //       },
  //       rows: [{
  //         cells: [{
  //           content: {
  //             plugin: {
  //               name: 'ory/editor/core/default'
  //             },
  //             state: {
  //               value: 'Lorem ipsum dolor sit amet.'
  //             }
  //           }
  //         }]
  //       }]
  //     }]
  //   }
  //
  //   const wrapper = mount(<HTMLRenderer state={state} plugins={plugins}/>)
  //   it('should contain "lorem ipsum"', () => {
  //     expect(wrapper.text()).toContain('Lorem ipsum')
  //   })
  //   it('should render the layout cell cell', () => {
  //     expect(wrapper.find('.layout-state')).toHaveLength(1)
  //   })
  // })
  //
  // describe('two content cells', () => {
  //   const state = {
  //     id: '1',
  //     cells: [{
  //       content: {
  //         plugin: {
  //           name: 'ory/editor/core/default'
  //         },
  //         state: {
  //           value: 'Lorem ipsum.'
  //         }
  //       }
  //     }, {
  //       content: {
  //         plugin: {
  //           name: 'ory/editor/core/default'
  //         },
  //         state: {
  //           value: 'dolor sit amet.'
  //         }
  //       }
  //     }]
  //   }
  //
  //   const wrapper = mount(<HTMLRenderer state={state} plugins={plugins}/>)
  //   it('should contain "lorem ipsum." and "dolor sit amet."', () => {
  //     expect(wrapper.text()).toContain('Lorem ipsum.')
  //     expect(wrapper.text()).toContain('dolor sit amet.')
  //   })
  //   it('should set the correct sizes although no sizes were given', () => {
  //     expect(wrapper.find('.ory-cell-sm-6')).toHaveLength(2)
  //   })
  // })
  describe('rendering html content from slate', () => {
    [
      {
        id: '1',
        cells: [
          {
            id: '4c0f5ab5-f331-4d69-8850-7de0df917cc2',
            size: 12,
            content: {
              plugin: {
                name: 'ory/editor/core/content/slate',
                version: '0.0.1',
              },
              state: {
                serialized: {
                  nodes: [
                    {
                      kind: 'block',
                      type: 'PARAGRAPH/PARAGRAPH',
                      nodes: [
                        {
                          kind: 'text',
                          text: 'Asdfg',
                        },
                      ],
                      data: {
                        align: 'center',
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    ].forEach((c, k) => {
      describe(`case ${k}`, () => {
        const wrapper = render(<HTMLRenderer state={c} plugins={plugins} />);
        it('should pass', () => {
          expect(wrapper.html()).toEqual(
            // tslint:disable-next-line:max-line-length
            '<div class="ory-cell ory-cell-sm-12 ory-cell-xs-12"><div class="ory-cell-inner ory-cell-leaf"><div data-gramm="false" data-slate-editor="true" data-slate-node="value" style="outline:none;white-space:pre-wrap;word-wrap:break-word"><p data-slate-node="element" style="text-align:center"><span data-slate-node="text"><span data-slate-leaf="true"><span data-slate-string="true">Asdfg</span></span></span></p></div></div></div>'
          );
        });
      });
    });
  });

  describe('two inlining content cells', () => {
    const state: EditableType = {
      id: '1',
      cells: [
        {
          id: '1_1',
          rows: [
            {
              id: '1_1_1',
              cells: [
                {
                  id: '1_1_1_1',
                  content: {
                    plugin: {
                      name: 'ory/editor/core/default',
                      version: '0.0.1',
                    },
                    state: { value: 'Lorem ipsum.' },
                  },
                  inline: 'left',
                },
                {
                  id: '1_1_1_2',
                  content: {
                    plugin: {
                      name: 'ory/editor/core/default',
                      version: '0.0.1',
                    },
                    state: { value: 'dolor sit amet.' },
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const wrapper = mount(<HTMLRenderer state={state} plugins={plugins} />);
    it('should contain "lorem ipsum." and "dolor sit amet."', () => {
      expect(wrapper.text()).toContain('Lorem ipsum.');
      expect(wrapper.text()).toContain('dolor sit amet.');
    });

    it('should set up inlining correctly for ory-cell-sm-6', () => {
      expect(wrapper.find('.ory-cell-sm-6')).toHaveLength(1);
    });

    it('should set up inlining correctly for ory-cell-sm-12', () => {
      expect(wrapper.find('.ory-cell-sm-12')).toHaveLength(2);
    });

    it('should set up inlining correctly for ory-cell-has-inline-neighbour', () => {
      expect(wrapper.find('.ory-cell-has-inline-neighbour')).toHaveLength(1);
    });

    it('should set up inlining correctly for ory-row-has-floating-children', () => {
      expect(wrapper.find('.ory-row-has-floating-children')).toHaveLength(1);
    });
  });
});
