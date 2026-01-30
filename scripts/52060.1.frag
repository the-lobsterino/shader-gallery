#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

precision highp float;
uniform float time;
uniform vec2 mouse;
#define time (mouse.x*5e0+0.02*cos(time/3.+float(gl_FragCoord.y)))
uniform vec2 resolution;

//const
const vec3 BLACK = vec3(0.01, 0.01, 0.01);
const vec3 WHITE = vec3(1.0, 1.0, 1.0);

const vec3 OLD_RED = vec3(0.886, 0.102, 0.353);
const vec3 OLD_YELLOW = vec3(0.925, 0.702, 0.176);
const vec3 OLD_BLUE = vec3(0.541, 0.831, 0.882);
const vec3 OLD_GREEN = vec3(0.392, 0.765, 0.631);
const vec3 OLD_RED_YELLOW = vec3(0.812, 0.071, 0.063);
const vec3 OLD_YELLOW_BLUE = vec3(0.486, 0.573, 0.145);
const vec3 OLD_BLUE_GREEN = vec3(0.204, 0.627, 0.549);
const vec3 OLD_GREEN_RED = vec3(0.345, 0.082, 0.220);

const vec3 NEW_RED = vec3(0.875, 0.102, 0.341);
const vec3 NEW_BLUE = vec3(0.216, 0.773, 0.941);
const vec3 NEW_GREEN = vec3(0.184, 0.714, 0.490);
const vec3 NEW_YELLOW = vec3(0.918, 0.690, 0.165);

const float TIME_DURATION = 6.0;

const float PI = 3.14159265359;

//easing finction
float easeInQuad(float t) {
    return t * t;
}
float easeOutQuad(float t) {
    return -1.0 * t * (t - 2.0);
}
float easeInOutQuad(float t) {
    if ((t *= 2.0) < 1.0) {
        return 0.5 * t * t;
    } else {
        return -0.5 * ((t - 1.0) * (t - 3.0) - 1.0);
    }
}

float easeInCubic(float t) {
    return t * t * t;
}
float easeOutCubic(float t) {
    return (t = t - 1.0) * t * t + 1.0;
}
float easeInOutCubic(float t) {
    if ((t *= 2.0) < 1.0) {
        return 0.5 * t * t * t;
    } else {
        return 0.5 * ((t -= 2.0) * t * t + 2.0);
    }
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle), -sin(_angle),
                sin(_angle), cos(_angle));
}

vec2 rotate(vec2 st, vec2 offset, float angle){
  st -= offset+0.5;
  st *= rotate2d(angle);
  st += offset+0.5;
  return st;
}

//beginより小さいと0, begin~endは0~1, end以降は1を返す
float linearstep(float begin, float end, float t) {
    return clamp((t - begin) / (end - begin), 0.0, 1.0);
}

float isShow(float begin, float end, float t){
  return (step(begin+0.001, t) * step(t, end+0.001));
}

float circle(vec2 _st, float _radius){
  vec2 dist = _st-vec2(0.5);
	return 1.0 - smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

float box(vec2 st, vec2 offset, vec2 size){
    size = vec2(0.5) - size;
    st -= offset+0.;
    vec2 uv = smoothstep(size,
                        size+vec2(0.001),
                        st);
    uv *= smoothstep(size,
                    size+vec2(0.001),
                    vec2(1.0) - st);
    return uv.x*uv.y;
}

float line( vec2 _st, vec2 _p1, vec2 _p2, float _width, float _spread){
    _st = _st-vec2(0.5);
    _width = 1.0 / _width;
    vec2 p2p1 = _p1 - _p2;
    vec2 p1p2 = -(p2p1);
    vec2 p2p = _st - _p2;
    vec2 p1p = _st - _p1;
    vec2 pp1 = -(p1p);
    vec2 pd = normalize(vec2(p2p1.y, -p2p1.x));
    float proj = dot(pd, pp1);
    float pr1 = dot(p2p1, p2p);
    float pr2 = dot(p1p2, p1p);

    if(pr1 > 0.0 && pr2 > 0.0) {
        return 1.0 - step(0.1, length(proj*_width));
    } else {
        return 0.0;
    }
}

vec2 posMove(vec2 p, float t){
  return p * (1.0 - linearstep(1.85, 2.0, t) * 0.7 + linearstep(2.0, 2.15, t) * 0.7);
}

// #記号がそれぞれ円になりくるくるまわって中央に集まるまで(0s~2.15s)
float circleAnimation(vec2 st, float t){
  float movementLength = 0.6;
  float moveAmount = (easeOutCubic(linearstep(1.0, 1.4, t))) * movementLength;  //移動量
  vec2 offset = vec2(moveAmount*1.0, moveAmount*0.0);        //移動方向
  vec2 maxOffset = movementLength * vec2(1.0, 0.0);

  float col = circle(st + posMove(vec2(-0.3, -0.16)+offset, t), 0.01) * isShow(0.0, 2.15, t); //円1
  col += circle(st+ posMove(vec2(-0.3, -0.16)+maxOffset, t), 0.01) * isShow(0.0, 2.15, t);    //円2
  col += line(st, vec2(0.3, 0.16)-offset, vec2(0.3, 0.16)-maxOffset, 0.5, 1.0) * isShow(0.0, 2.15, t);  //直線

  //stepで0~1の範囲に収める
  col = step(0.01, col);
  return col;
}

// 中央に集まった円が新しい記号になるまで(2.15s~TIME_DURATIONまで)
float newCircleAnimation(vec2 st, float t){
  float movementLength = 0.6;
  vec2 maxOffset = movementLength * vec2(1.0, 0.);

  float downCircle = 0.18 * easeInOutCubic(linearstep(2.6, 3.0, t));
	
  //切り替わった時の吹き出しの方の円
  float col = circle(st + posMove(vec2(-0.3, -0.16)+maxOffset, t) - vec2(downCircle*0.975, downCircle*0.2), 0.014) * isShow(2.15, TIME_DURATION, t);

  //切り替わった時の線の方の円2つ
  col += circle(st + posMove(vec2(-0.3, -0.2)+maxOffset, t) - vec2(downCircle*0.2, -downCircle*0.975), 0.012) * isShow(2.6, TIME_DURATION, t);
  col += circle(st + posMove(vec2(-0.3, -0.2)+maxOffset, t) - vec2(downCircle*1.2, -downCircle*0.794), 0.012) * isShow(2.6, TIME_DURATION, t);

  vec2 initialPos = vec2(-0.88, 0.187);

  st = rotate(st, posMove(initialPos + maxOffset, t), -PI*0.058);

  float moveAmount = (easeOutCubic(linearstep(2.6, 3.0, t))) * 0.35;  //移動量
  vec2 offset = vec2(moveAmount, moveAmount*0.0);

  vec2 ballonRectPos = vec2(0.003, -0.048);
  float downY = 0.18 * easeInOutCubic(linearstep(2.6, 3.0, t));
	
  //切り替わった時の吹き出しの方の四角形
  col += box(st, initialPos + ballonRectPos + maxOffset - vec2(-downY, 0.0), vec2(0.031)) * isShow(2.15, TIME_DURATION, t);

  float ease = easeInOutCubic(linearstep(2.7, 2.9, t));
  float linePosY = 0.0375 + (0.075 - 0.0375) * ease;
	
  //切り替わった時の線の方の四角形
  col += box(st, initialPos + maxOffset + vec2(linePosY, 0.017) - vec2(0.0, downY), vec2(0.09*ease, 0.055)) * isShow(2.6, TIME_DURATION, t);

 //stepで0~1の範囲に収める
  col = step(0.01, col); 
	
  return col;
}

//==================================================================================================================================================================

//main
void main() {
  vec2 pos = gl_FragCoord.xy / min(resolution.x, resolution.y);
  vec2 offset = vec2(0.36, 0.0);
  vec2 st = pos - offset;

  vec3 color = vec3(0.0);

  //時間
  float t = mod(time, TIME_DURATION);

  //回転
  st = rotate(st, vec2(0.0), PI*2.0 * (linearstep(1.0, 2.0, t) + easeOutCubic(linearstep(2.0, 2.5, t))*0.3185) * 1.0 - PI*0.08);

  //blue
  float oldCol1 = circleAnimation(st, t);
  float newCol1 = newCircleAnimation(st, t);

  //yellow（90度回転させたもの）
  st = rotate(st, vec2(0.), PI*0.5);

  float oldCol2 = circleAnimation(st, t);
  float newCol2 = newCircleAnimation(st, t);

  //red（さらに90度回転させたもの）
  st = rotate(st, vec2(0.), PI*0.5);

  float oldCol3 = circleAnimation(st, t);
  float newCol3 = newCircleAnimation(st, t);

  //green（さらに90度回転させたもの）
  st = rotate(st, vec2(0.), PI*0.5);

  float oldCol4 = circleAnimation(st, t);
  float newCol4 = newCircleAnimation(st, t);

  //描画（旧）
  color += mix(BLACK, OLD_BLUE, oldCol1 - oldCol1 * oldCol2);
  color += mix(BLACK, OLD_YELLOW, oldCol2 - oldCol1 * oldCol2);
  color += mix(BLACK, OLD_YELLOW_BLUE, oldCol1 * oldCol2);

  color -= mix(BLACK, OLD_YELLOW, oldCol2 * oldCol3);
  color += mix(BLACK, OLD_RED, oldCol3 - oldCol2 * oldCol3);
  color += mix(BLACK, OLD_RED_YELLOW, oldCol2 * oldCol3);

  color -= mix(BLACK, OLD_RED, oldCol3 * oldCol4);
  color += mix(BLACK, OLD_GREEN, oldCol4 - oldCol3 * oldCol4);
  color += mix(BLACK, OLD_GREEN_RED, oldCol3 * oldCol4);

  color -= mix(BLACK, OLD_GREEN, oldCol4 * oldCol1);
  color -= mix(BLACK, OLD_BLUE, oldCol4 * oldCol1);
  color += mix(BLACK, OLD_BLUE_GREEN, oldCol4 * oldCol1);

  //描画（新）
  color += mix(BLACK, NEW_GREEN, newCol1);
  color += mix(BLACK, NEW_YELLOW, newCol2);
  color += mix(BLACK, NEW_RED, newCol3);
  color += mix(BLACK, NEW_BLUE, newCol4);

  gl_FragColor = vec4(color, 1.0);

}
