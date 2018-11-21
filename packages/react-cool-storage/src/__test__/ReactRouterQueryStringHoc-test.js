// @flow
import React from 'react';
import ReactRouterQueryStringHoc from '../ReactRouterQueryStringHoc';

// let shallowRenderHoc = (props, hock) => {
//     let Component = hock((props) => <div />);
//     return shallow(<Component {...props}/>);
// };

// test('ReactRouterQueryStringHoc config should pass props through', () => {
//     let propsGivenToInnerComponent = shallowRenderHoc(
//         {
//             testParcel: new Parcel(),
//             abc: 123,
//             def: 456
//         },
//         ReactRouterQueryStringHoc({
//             name: 'testParcel'
//         })
//     ).dive().props();

//     expect(propsGivenToInnerComponent.abc).toBe(123);
//     expect(propsGivenToInnerComponent.def).toBe(456);
// });


// test('ReactRouterQueryStringHoc config should pass props through with no parcel found', () => {
//     let propsGivenToInnerComponent = shallowRenderHoc(
//         {
//             abc: 123,
//             def: 456
//         },
//         ReactRouterQueryStringHoc({
//             name: 'testParcel'
//         })
//     ).props();

//     expect(propsGivenToInnerComponent.abc).toBe(123);
//     expect(propsGivenToInnerComponent.def).toBe(456);
// });


// test('ReactRouterQueryStringHoc config should pass ParcelBoundary parcel down under same prop name', () => {
//     let propsGivenToInnerComponent = shallowRenderHoc(
//         {
//             testParcel: new Parcel({
//                 value: 789
//             })
//         },
//         ReactRouterQueryStringHoc({
//             name: 'testParcel'
//         })
//     ).dive().props();

//     // parcel has correct contents
//     expect(propsGivenToInnerComponent.testParcel.value).toBe(789);

//     // parcel is passed through parcel boundary as evidenced by "~bs" in its id
//     expect(propsGivenToInnerComponent.testParcel.id.indexOf("~bs")).not.toBe(-1);
// });

// test('ReactRouterQueryStringHoc config should pass actions as config.name + "Actions', () => {
//     let propsGivenToInnerComponent = shallowRenderHoc(
//         {
//             testParcel: new Parcel({
//                 value: 789
//             })
//         },
//         ReactRouterQueryStringHoc({
//             name: 'testParcel'
//         })
//     ).dive().props();

//     // testParcelActions shoudl contain a ParcelBoundaryActions object
//     expect(typeof propsGivenToInnerComponent.testParcelActions.release).toBe("function");
//     expect(typeof propsGivenToInnerComponent.testParcelActions.cancel).toBe("function");
// });

// test('ReactRouterQueryStringHoc config should pass buffered prop as config.name + "Buffered', () => {
//     let propsGivenToInnerComponent = shallowRenderHoc(
//         {
//             testParcel: new Parcel({
//                 value: 789
//             })
//         },
//         ReactRouterQueryStringHoc({
//             name: 'testParcel'
//         })
//     ).dive().props();

//     // testParcelBuffered should contain a boolean object
//     expect(typeof propsGivenToInnerComponent.testParcelBuffered).toBe("boolean");
// });

// test('ReactRouterQueryStringHoc config.name should accept props function returning string', () => {
//     let propsGivenToInnerComponent = shallowRenderHoc(
//         {
//             testParcel: new Parcel({
//                 value: 789
//             }),
//             parcelName: 'testParcel'
//         },
//         ReactRouterQueryStringHoc({
//             name: (props: Object) => props.parcelName
//         })
//     ).dive().props();

//     // parcel has correct contents
//     expect(propsGivenToInnerComponent.testParcel.value).toBe(789);

//     // parcel is passed through parcel boundary as evidenced by "~bs" in its id
//     expect(propsGivenToInnerComponent.testParcel.id.indexOf("~bs")).not.toBe(-1);
// });

// test('ReactRouterQueryStringHoc config.debounce should accept number', () => {
//     let propsGivenToParcelBoundary = shallowRenderHoc(
//         {
//             testParcel: new Parcel()
//         },
//         ReactRouterQueryStringHoc({
//             name: 'testParcel',
//             debounce: 100
//         })
//     ).props();

//     expect(propsGivenToParcelBoundary.debounce).toBe(100);
// });

// test('ReactRouterQueryStringHoc config.debounce should accept props function returning number', () => {
//     let propsGivenToParcelBoundary = shallowRenderHoc(
//         {
//             testParcel: new Parcel(),
//             debounce: 100
//         },
//         ReactRouterQueryStringHoc({
//             name: 'testParcel',
//             debounce: (props) => props.debounce
//         })
//     ).props();

//     expect(propsGivenToParcelBoundary.debounce).toBe(100);
// });

// test('ReactRouterQueryStringHoc config.hold should accept number', () => {
//     let propsGivenToParcelBoundary = shallowRenderHoc(
//         {
//             testParcel: new Parcel()
//         },
//         ReactRouterQueryStringHoc({
//             name: 'testParcel',
//             hold: true
//         })
//     ).props();

//     expect(propsGivenToParcelBoundary.hold).toBe(true);
// });

// test('ReactRouterQueryStringHoc config.hold should accept props function returning number', () => {
//     let propsGivenToParcelBoundary = shallowRenderHoc(
//         {
//             testParcel: new Parcel(),
//             hold: true
//         },
//         ReactRouterQueryStringHoc({
//             name: 'testParcel',
//             hold: (props) => props.hold
//         })
//     ).props();

//     expect(propsGivenToParcelBoundary.hold).toBe(true);
// });

// test('ReactRouterQueryStringHoc config.debugBuffer should accept number', () => {
//     let propsGivenToParcelBoundary = shallowRenderHoc(
//         {
//             testParcel: new Parcel()
//         },
//         ReactRouterQueryStringHoc({
//             name: 'testParcel',
//             debugBuffer: true
//         })
//     ).props();

//     expect(propsGivenToParcelBoundary.debugBuffer).toBe(true);
// });

// test('ReactRouterQueryStringHoc should be not use pure rendering', () => {
//     let propsGivenToParcelBoundary = shallowRenderHoc(
//         {
//             testParcel: new Parcel()
//         },
//         ReactRouterQueryStringHoc({
//             name: 'testParcel'
//         })
//     ).props();

//     expect(propsGivenToParcelBoundary.pure).toBe(false);
// });

// test('ReactRouterQueryStringHoc config should optionally allow originalParcelProp to pass down original parcel', () => {
//     let testParcel = new Parcel({
//         value: 789
//     });

//     let propsGivenToInnerComponent = shallowRenderHoc(
//         {
//             testParcel
//         },
//         ReactRouterQueryStringHoc({
//             name: 'testParcel',
//             originalParcelProp: 'originalParcel'
//         })
//     ).dive().props();

//     expect(propsGivenToInnerComponent.originalParcel).toBe(testParcel);
// });
