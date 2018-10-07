function drawInnerCircle(ctx, ringNo) {

    ctx.save();

    ctx.beginPath();

    // outer circle
    ctx.moveTo(2990.4, 621.8);
    ctx.bezierCurveTo(2978.8, 594.5, 2964.3, 568.9, 2946.9, 545.2);
    ctx.lineTo(3006.9, 485.0);
    ctx.lineTo(2959.3, 437.5);
    ctx.lineTo(2902.4, 494.6);
    ctx.bezierCurveTo(2869.0, 462.8, 2830.7, 437.6, 2788.2, 419.6);
    ctx.bezierCurveTo(2741.4, 399.8, 2691.6, 389.8, 2640.3, 389.8);
    ctx.bezierCurveTo(2589.1, 389.8, 2539.3, 399.8, 2492.4, 419.6);
    ctx.bezierCurveTo(2447.2, 438.8, 2406.6, 466.2, 2371.7, 501.0);
    ctx.bezierCurveTo(2336.8, 535.9, 2309.4, 576.5, 2290.3, 621.8);
    ctx.bezierCurveTo(2270.5, 668.7, 2260.4, 718.4, 2260.4, 769.7);
    ctx.bezierCurveTo(2260.4, 820.9, 2270.5, 870.7, 2290.3, 917.6);
    ctx.bezierCurveTo(2303.5, 948.8, 2320.7, 977.9, 2341.5, 1004.3);
    ctx.lineTo(2268.4, 1077.7);
    ctx.lineTo(2316.0, 1125.1);
    ctx.lineTo(2387.6, 1053.3);
    ctx.bezierCurveTo(2418.7, 1081.1, 2453.9, 1103.4, 2492.4, 1119.7);
    ctx.bezierCurveTo(2539.3, 1139.5, 2589.1, 1149.6, 2640.3, 1149.6);
    ctx.bezierCurveTo(2691.6, 1149.6, 2741.4, 1139.5, 2788.2, 1119.7);
    ctx.bezierCurveTo(2833.5, 1100.6, 2874.1, 1073.2, 2909.0, 1038.3);
    ctx.bezierCurveTo(2943.8, 1003.5, 2971.2, 962.8, 2990.4, 917.6);
    ctx.bezierCurveTo(3010.2, 870.7, 3020.2, 820.9, 3020.2, 769.7);
    ctx.bezierCurveTo(3020.2, 718.4, 3010.2, 668.7, 2990.4, 621.8);
    ctx.fillStyle = "rgb(108, 206, 234)";
    ctx.fill();
    ctx.closePath();

    // inner circle
    ctx.beginPath();
    ctx.moveTo(2824.1, 953.5);
    ctx.bezierCurveTo(2775.0, 1002.6, 2709.8, 1029.6, 2640.3, 1029.6);
    ctx.bezierCurveTo(2570.9, 1029.6, 2505.6, 1002.6, 2456.5, 953.5);
    ctx.bezierCurveTo(2407.4, 904.4, 2380.4, 839.1, 2380.4, 769.7);
    ctx.bezierCurveTo(2380.4, 700.3, 2407.4, 635.0, 2456.5, 585.9);
    ctx.bezierCurveTo(2505.6, 536.8, 2570.9, 509.8, 2640.3, 509.8);
    ctx.bezierCurveTo(2709.8, 509.8, 2775.0, 536.8, 2824.1, 585.9);
    ctx.bezierCurveTo(2873.2, 635.0, 2900.2, 700.3, 2900.2, 769.7);
    ctx.bezierCurveTo(2900.2, 839.1, 2873.2, 904.4, 2824.1, 953.5);
    ctx.fillStyle = "rgb(256,256,256)";
    ctx.fill();
    ctx.closePath();

    drawInnerCircleText(ctx)
    ctx.fill();

    ctx.restore();
}
function drawInnerCircleText(ctx) {
    ctx.fillStyle = "rgb(256,256,256)";
    ctx.save();
    ctx.beginPath();

    // outerRing/Group/Compound Path/Path
    ctx.moveTo(2777.3, 536.2);
    ctx.lineTo(2767.9, 544.8);
    ctx.lineTo(2758.3, 538.9);
    ctx.lineTo(2796.0, 506.2);
    ctx.lineTo(2808.1, 513.7);
    ctx.lineTo(2795.5, 562.0);
    ctx.lineTo(2785.6, 555.8);
    ctx.lineTo(2788.9, 543.5);
    ctx.lineTo(2777.3, 536.2);
    ctx.closePath();

    // outerRing/Group/Compound Path/Path
    ctx.moveTo(2791.9, 535.8);
    ctx.lineTo(2794.7, 525.7);
    ctx.bezierCurveTo(2795.4, 522.8, 2796.6, 519.4, 2797.5, 516.6);
    ctx.lineTo(2797.4, 516.5);
    ctx.bezierCurveTo(2795.3, 518.5, 2792.7, 521.2, 2790.6, 523.2);
    ctx.lineTo(2782.9, 530.2);
    ctx.lineTo(2791.9, 535.8);
    ctx.closePath();
    ctx.fill();

    // outerRing/Group/Compound Path
    ctx.beginPath();

    // outerRing/Group/Compound Path/Path
    ctx.moveTo(2842.4, 540.1);
    ctx.bezierCurveTo(2845.3, 542.2, 2849.3, 545.5, 2853.4, 549.5);
    ctx.bezierCurveTo(2858.5, 554.5, 2861.3, 558.8, 2861.9, 563.1);
    ctx.bezierCurveTo(2862.3, 566.7, 2861.1, 570.2, 2858.1, 573.3);
    ctx.bezierCurveTo(2853.8, 577.6, 2847.8, 577.6, 2843.8, 575.7);
    ctx.lineTo(2843.7, 575.9);
    ctx.bezierCurveTo(2845.1, 579.2, 2844.2, 582.8, 2842.0, 586.7);
    ctx.bezierCurveTo(2839.3, 591.6, 2836.0, 597.1, 2835.4, 599.1);
    ctx.lineTo(2827.5, 591.3);
    ctx.bezierCurveTo(2827.8, 589.8, 2829.8, 586.2, 2832.8, 581.0);
    ctx.bezierCurveTo(2836.1, 575.9, 2835.7, 573.3, 2832.6, 570.1);
    ctx.lineTo(2830.3, 567.9);
    ctx.lineTo(2817.2, 581.2);
    ctx.lineTo(2809.5, 573.7);
    ctx.lineTo(2842.4, 540.1);
    ctx.closePath();

    // outerRing/Group/Compound Path/Path
    ctx.moveTo(2835.7, 562.3);
    ctx.lineTo(2838.8, 565.3);
    ctx.bezierCurveTo(2842.7, 569.1, 2846.8, 569.4, 2849.7, 566.4);
    ctx.bezierCurveTo(2852.8, 563.3, 2852.2, 559.6, 2848.7, 556.1);
    ctx.bezierCurveTo(2846.8, 554.3, 2845.6, 553.4, 2844.9, 552.9);
    ctx.lineTo(2835.7, 562.3);
    ctx.closePath();
    ctx.fill();

    // outerRing/Group/Compound Path
    ctx.beginPath();

    // outerRing/Group/Compound Path/Path
    ctx.moveTo(2883.7, 599.4);
    ctx.lineTo(2876.5, 588.7);
    ctx.lineTo(2884.0, 583.6);
    ctx.lineTo(2904.6, 614.3);
    ctx.lineTo(2897.0, 619.3);
    ctx.lineTo(2889.7, 608.4);
    ctx.lineTo(2857.7, 629.9);
    ctx.lineTo(2851.6, 620.9);
    ctx.lineTo(2883.7, 599.4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
