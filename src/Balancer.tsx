import React, {
    ReactNode,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
  } from "react";
  import { LayoutChangeEvent, Text, View } from "react-native";
  
  type Props = {
    children?: ReactNode;
  };
  
  const ratio = 1;
  
  // export const BareBalancer: React.FC<Props> = ({ children }) => {
  //   // const [prevClientHeight, setPrevClientHeight] = useState<number | undefined>();
  //   const [viewWidth, setViewWidth] = useState<number | undefined>(undefined);
  //   const [ran, setRan] = useState<boolean>(false);
  //   useEffect(() => {
  //     setRan(false);
  //   }, [children]);
  
  //   const update = (width: number) => setViewWidth(width);
  
  //   const onPageLayout = (event: LayoutChangeEvent) => {
  //     if (!ran) {
  //       setRan(true);
  //       const { width, height } = event.nativeEvent.layout;
  
  //       const initialHeight = height;
  
  //       let left: number = width / 2;
  //       let right: number = width;
  //       let middle: number;
  
  //       while (left + 1 < right) {
  //         middle = ~~((left + right) / 2);
  //         update(middle);
  //         if (initialHeight === height) {
  //           right = middle;
  //         } else {
  //           left = middle;
  //         }
  //       }
  
  //       // Update the wrapper width
  //       update(right * ratio + width * (1 - ratio));
  //     }
  //   };
  
  //   return (
  //     <View style={{ maxWidth: viewWidth }} onLayout={onPageLayout}>
  //       {children}
  //     </View>
  //   );
  // };
  
  type BareBalancerProps = {
    containerWidth?: number;
    containerHeight?: number;
    initialHeight?: number;
    children?: ReactNode;
    parentRef: React.RefObject<View>;
  };
  
  const measureComponent = (component: React.RefObject<View>) => {
    return new Promise((resolve, reject) => {
      if (component.current === null) return { width: 0, height: 0 };
      component.current.measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          resolve({ width, height });
        }
      );
    });
  };
  
  export const BareBalancerContainer: React.FC<Props> = ({ children }) => {
    //const [ran, setRan] = useState<boolean>(false);
    const [dimensions, setDimensions] = useState<
      { width: number; height: number } | undefined
    >();
    const [initialDimensions, setInitialDimensions] = useState<
      { width: number; height: number } | undefined
    >();
  
    const parentRef = useRef<View>(null);
    // useEffect(() => {
    //   setRan(false);
    // }, [children]);
  
    const onPageLayout = (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
  
      if (initialDimensions === undefined) {
        setInitialDimensions({ width, height });
      }
  
      setDimensions({ width, height });
      // console.log(width, height);
    };
  
    return (
      <View
        ref={parentRef}
        onLayout={onPageLayout}
        style={{
          backgroundColor: "red",
          flexDirection: "row",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <BareBalancerWithoutPageLayout
          parentRef={parentRef}
          containerHeight={dimensions?.height}
          containerWidth={dimensions?.width}
          initialHeight={initialDimensions?.height}
        >
          {children}
        </BareBalancerWithoutPageLayout>
      </View>
    );
  };
  
  export const BareBalancerWithoutPageLayout: React.FC<BareBalancerProps> = ({
    children,
    containerHeight,
    containerWidth,
    initialHeight,
    parentRef,
  }) => {
    const [viewWidth, setViewWidth] = useState<number | undefined>(undefined);
    const [ran, setRan] = useState<boolean>(false);
    const childRef = useRef<View>(null);
  
    useEffect(() => {
      setRan(false);
    }, [children]);
  
    //   const update = (width: number) => setViewWidth(width);
  
    //   const finalUpdate = (width: number) => {
    //     setRan(true);
    //     setViewWidth(width);
    //   };
    useLayoutEffect(() => {
      const relayout = async () => {
        const update = (width?: number) =>
          childRef.current?.setNativeProps({ style: { maxWidth: width } });
  
        update(undefined);
        setRan(true);
        const { height: initialHeight, width: initialWidth } =
          await measureComponent(parentRef);
  
        const width: number = initialWidth;
        let height: number = initialHeight;
  
        let left: number = initialWidth / 2;
        let right: number = initialWidth;
        let middle: number;
  
        while (left + 1 < right) {
          // console.log(`left ${left}, right ${right}`);
          middle = ~~((left + right) / 2);
  
          update(middle);
          const { height: currentHeight, width: currentWidth } =
            await measureComponent(parentRef);
  
          // console.log({ containerHeight, initialHeight });
          //Virtually work out what the container height would be when the max width has been updated
          console.log(
            `currentHeight: ${currentHeight}, currentWidth: ${currentWidth}`
          );
          if (currentHeight === height) {
            right = middle;
          } else {
            left = middle;
            height = currentHeight;
          }
          console.log(`left: ${left} - middle ${middle} - right: ${right}`);
        }
  
        console.log("final right: ", right);
        console.log("final width: ", width);
        // Update the wrapper width
        update(right * ratio + initialWidth * (1 - ratio));
      };
      if (!ran) {
        if (containerHeight === undefined || containerWidth === undefined) return;
  
        if (parentRef.current === null) return;
        void relayout();
        //   let parentHeight: number;
        //   let parentWidth: number;
        //   parentRef.current?.measure(
        //     (x: number, y: number, wid: number, hei: number) => {
        //       setRan(true);
        //       console.log("wid:", wid, " hei:", hei);
  
        //       parentWidth = wid;
        //       parentHeight = hei;
  
        //       let left: number = parentWidth / 2;
        //       let right: number = parentWidth;
        //       let middle: number;
  
        //       while (left + 1 < right) {
        //         // console.log(`left ${left}, right ${right}`);
        //         middle = ~~((left + right) / 2);
        //         parentRef.current?.setNativeProps({ style: { maxWidth: middle } });
  
        //         // console.log({ containerHeight, initialHeight });
        //         //Virtually work out what the container height would be when the max width has been updated
        //         if (parentHeight === containerHeight) {
        //           right = middle;
        //           console.log(`right shifted: ${right}`);
        //         } else {
        //           left = middle;
        //           console.log(`left shifted: ${left}`);
        //         }
        //       }
  
        //       // Update the wrapper width
        //       parentRef.current?.setNativeProps({
        //         style: { maxWidth: right * ratio + parentWidth * (1 - ratio) },
        //       });
  
        //       //   finalUpdate(right * ratio + containerWidth * (1 - ratio));
        //     }
        //   );
  
        //   let left: number = containerWidth / 2;
        //   let right: number = containerWidth;
        //   let middle: number;
  
        //   while (left + 1 < right) {
        //     console.log("while");
        //     console.log(parentHeight);
        //     // console.log(`left ${left}, right ${right}`);
        //     middle = ~~((left + right) / 2);
        //     update(middle);
        //     // console.log({ containerHeight, initialHeight });
        //     //Virtually work out what the container height would be when the max width has been updated
        //     if (parentHeight === containerHeight) {
        //       right = middle;
        //     } else {
        //       left = middle;
        //     }
        //   }
  
        //   // Update the wrapper width
        //   finalUpdate(right * ratio + containerWidth * (1 - ratio));
      }
    }, [containerHeight, containerWidth, initialHeight, ran, parentRef]);
  
    //   console.log("rerendered?");
  
    return (
      <View
        style={{
          backgroundColor: "green",
        }}
        ref={childRef}
      >
        {children}
      </View>
    );
  };
  