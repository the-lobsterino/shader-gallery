#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
//fixed
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

  float seconds=10.;
  float _Speed=2.;
  float _Size=2.;
  float _Skew=1.0;
  float _Shear=0.0;
  float _Fade=2.0;
  float _Contrast=2.0;
 

    void main ()
    {
      vec2 vTex = 2.*gl_FragCoord.xy/resolution.xy;
      vec4 _Color1;
      vec4 _Color2;
      _Color1 = vec4(0.100000,1.000000,1.000000,1.000000);
      _Color2 = vec4(0.000000,0.460000,1.000000,0.000000);
      lowp vec4 tmpvar_1;
      highp float val_2;
      highp float noisePos_3;
      highp vec4 color_4;
      mediump float tmpvar_5;
      tmpvar_5 = (1.0 - vTex.y);
      highp vec4 tmpvar_6;
      tmpvar_6 = mix (_Color1, _Color2, vec4(tmpvar_5));
      color_4 = tmpvar_6;
      mediump float tmpvar_7;
      tmpvar_7 = vTex.x;
      noisePos_3 = tmpvar_7;
      noisePos_3 += -0.5;
      noisePos_3 = (noisePos_3 * _Size);
      noisePos_3 = (noisePos_3 + (tmpvar_5 * (_Size * _Skew)));
      noisePos_3 = (noisePos_3 * (1.0/(mix (1.0, _Shear, tmpvar_5))));
      highp vec2 tmpvar_8;
      tmpvar_8.x = noisePos_3;
      tmpvar_8.y = (time * _Speed);
      highp vec2 P_9;
      P_9 = tmpvar_8;
      highp vec4 gx_10;
      highp float tmpvar_11;
      tmpvar_11 = (float(mod (floor((tmpvar_8.y / 1000.0)), 2.0)));
      if ((tmpvar_11 == 0.0)) {
        P_9.y = (tmpvar_8.y - (floor(
          (tmpvar_8.y / 1000.0)
        ) * 1000.0));
      } else {
        P_9.y = (P_9.y - (floor(
          (P_9.y / 1000.0)
        ) * 1000.0));
        P_9.y = (1000.0 - P_9.y);
      };
      highp vec4 tmpvar_12;
      tmpvar_12 = (floor(P_9.xyxy) + vec4(0.0, 0.0, 1.0, 1.0));
      highp vec4 tmpvar_13;
      tmpvar_13 = (fract(P_9.xyxy) - vec4(0.0, 0.0, 1.0, 1.0));
      highp vec4 tmpvar_14;
      tmpvar_14 = tmpvar_13.xzxz;
      highp vec4 tmpvar_15;
      tmpvar_15 = tmpvar_13.yyww;
      highp vec4 tmpvar_16;
      tmpvar_16 = (((34.0 *
        (tmpvar_12.xzxz * tmpvar_12.xzxz)
      ) + tmpvar_12.xzxz) / vec4(289.0, 289.0, 289.0, 289.0));
      highp vec4 tmpvar_17;
      tmpvar_17 = (fract(abs(tmpvar_16)) * vec4(289.0, 289.0, 289.0, 289.0));
      highp float tmpvar_18;
      if ((tmpvar_16.x >= 0.0)) {
        tmpvar_18 = tmpvar_17.x;
      } else {
        tmpvar_18 = -(tmpvar_17.x);
      };
      highp float tmpvar_19;
      if ((tmpvar_16.y >= 0.0)) {
        tmpvar_19 = tmpvar_17.y;
      } else {
        tmpvar_19 = -(tmpvar_17.y);
      };
      highp float tmpvar_20;
      if ((tmpvar_16.z >= 0.0)) {
        tmpvar_20 = tmpvar_17.z;
      } else {
        tmpvar_20 = -(tmpvar_17.z);
      };
      highp float tmpvar_21;
      if ((tmpvar_16.w >= 0.0)) {
        tmpvar_21 = tmpvar_17.w;
      } else {
        tmpvar_21 = -(tmpvar_17.w);
      };
      highp vec4 tmpvar_22;
      tmpvar_22.x = tmpvar_18;
      tmpvar_22.y = tmpvar_19;
      tmpvar_22.z = tmpvar_20;
      tmpvar_22.w = tmpvar_21;
      highp vec4 x_23;
      x_23 = (tmpvar_22 + tmpvar_12.yyww);
      highp vec4 tmpvar_24;
      tmpvar_24 = (((34.0 *
        (x_23 * x_23)
      ) + x_23) / vec4(289.0, 289.0, 289.0, 289.0));
      highp vec4 tmpvar_25;
      tmpvar_25 = (fract(abs(tmpvar_24)) * vec4(289.0, 289.0, 289.0, 289.0));
      highp float tmpvar_26;
      if ((tmpvar_24.x >= 0.0)) {
        tmpvar_26 = tmpvar_25.x;
      } else {
        tmpvar_26 = -(tmpvar_25.x);
      };
      highp float tmpvar_27;
      if ((tmpvar_24.y >= 0.0)) {
        tmpvar_27 = tmpvar_25.y;
      } else {
        tmpvar_27 = -(tmpvar_25.y);
      };
      highp float tmpvar_28;
      if ((tmpvar_24.z >= 0.0)) {
        tmpvar_28 = tmpvar_25.z;
      } else {
        tmpvar_28 = -(tmpvar_25.z);
      };
      highp float tmpvar_29;
      if ((tmpvar_24.w >= 0.0)) {
        tmpvar_29 = tmpvar_25.w;
      } else {
        tmpvar_29 = -(tmpvar_25.w);
      };
      highp vec4 tmpvar_30;
      tmpvar_30.x = tmpvar_26;
      tmpvar_30.y = tmpvar_27;
      tmpvar_30.z = tmpvar_28;
      tmpvar_30.w = tmpvar_29;
      highp vec4 tmpvar_31;
      tmpvar_31 = ((fract(
        (tmpvar_30 / 41.0)
      ) * 2.0) - 1.0);
      highp vec4 tmpvar_32;
      tmpvar_32 = (abs(tmpvar_31) - 0.5);
      gx_10 = (tmpvar_31 - floor((tmpvar_31 + 0.5)));
      highp vec2 tmpvar_33;
      tmpvar_33.x = gx_10.x;
      tmpvar_33.y = tmpvar_32.x;
      highp vec2 tmpvar_34;
      tmpvar_34.x = gx_10.y;
      tmpvar_34.y = tmpvar_32.y;
      highp vec2 tmpvar_35;
      tmpvar_35.x = gx_10.z;
      tmpvar_35.y = tmpvar_32.z;
      highp vec2 tmpvar_36;
      tmpvar_36.x = gx_10.w;
      tmpvar_36.y = tmpvar_32.w;
      highp vec4 tmpvar_37;
      tmpvar_37.x = dot (tmpvar_33, tmpvar_33);
      tmpvar_37.y = dot (tmpvar_35, tmpvar_35);
      tmpvar_37.z = dot (tmpvar_34, tmpvar_34);
      tmpvar_37.w = dot (tmpvar_36, tmpvar_36);
      highp vec4 tmpvar_38;
      tmpvar_38 = (1.792843 - (0.8537347 * tmpvar_37));
      highp vec2 tmpvar_39;
      tmpvar_39.x = tmpvar_14.x;
      tmpvar_39.y = tmpvar_15.x;
      highp vec2 tmpvar_40;
      tmpvar_40.x = tmpvar_14.y;
      tmpvar_40.y = tmpvar_15.y;
      highp vec2 tmpvar_41;
      tmpvar_41.x = tmpvar_14.z;
      tmpvar_41.y = tmpvar_15.z;
      highp vec2 tmpvar_42;
      tmpvar_42.x = tmpvar_14.w;
      tmpvar_42.y = tmpvar_15.w;
      highp vec2 tmpvar_43;
      tmpvar_43 = (((6.0 *
        pow (tmpvar_13.xy, vec2(5.0, 5.0))
      ) - (15.0 *
        pow (tmpvar_13.xy, vec2(4.0, 4.0))
      )) + (10.0 * pow (tmpvar_13.xy, vec2(3.0, 3.0))));
      highp vec2 tmpvar_44;
      tmpvar_44.x = dot ((tmpvar_33 * tmpvar_38.x), tmpvar_39);
      tmpvar_44.y = dot ((tmpvar_35 * tmpvar_38.y), tmpvar_41);
      highp vec2 tmpvar_45;
      tmpvar_45.x = dot ((tmpvar_34 * tmpvar_38.z), tmpvar_40);
      tmpvar_45.y = dot ((tmpvar_36 * tmpvar_38.w), tmpvar_42);
      highp vec2 tmpvar_46;
      tmpvar_46 = mix (tmpvar_44, tmpvar_45, tmpvar_43.xx);
      val_2 = ((_Contrast * (
        (((2.3 * mix (tmpvar_46.x, tmpvar_46.y, tmpvar_43.y)) / 2.0) + 0.5)
       - 0.5)) + 0.5);
      color_4.y = (tmpvar_6.w * mix (val_2, (val_2 * vTex.y), _Fade));
      tmpvar_1 = color_4;
      gl_FragColor = tmpvar_1;
    }
