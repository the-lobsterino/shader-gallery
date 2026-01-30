// See https://www.shadertoy.com/view/MlSSWV
//     https://www.shadertoy.com/view/4tfGWr

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define pi 3.14159

const float indent = 0.05;
float angular = 6.0;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(float n)
{
  return fract((1.0 + cos(n)) * 415.92653);
}

float noise2d(vec2 x)
{
  float xhash = hash(x.x * 37.0);
  float yhash = hash(x.y * 57.0);
	
  return fract(xhash + yhash);
}

float drawStar(vec2 res, float ttime, vec2 o, float size, float startAngle)
{
  vec2 q = o;
	
  q *= normalize(resolution).xy;

  mat4 RotationMatrix = mat4(
	  cos(startAngle),
	  -sin(startAngle), 
	  0.0,
	  0.0,
	  sin(startAngle),
	  cos(startAngle),
	  0.0,
	  0.0,
	  0.0,
	  0.0,
	  1.0,
	  0.0,
	  0.0,
	  0.0,
	  0.0,
	  1.0 );
	
  q = (RotationMatrix * vec4(q, 0.0, 1.0)).xy;

  float angle = atan(q.y, q.x) / (2.0 * pi);

  float segment = angle * angular;

  float segmentI = floor(segment);
  float segmentF = fract(segment);

  angle = (segmentI + 0.5) / angular;

  if (segmentF > 0.5)
    angle -= indent;
  else
    angle += indent;
	
  angle *= 2.0 * pi;

  vec2 outline;
	
  outline.y = sin(angle);
  outline.x = cos(angle);

  float dist = abs(dot(outline, q));

  float ss = size * (1.0 + 0.2 * sin(ttime * hash(size) * 20.0));
	
  float r = angular * ss;

  float star = smoothstep(r, r + 0.005, dist);

  return star;
}

float drawFlare(vec2 res, vec2 o, float size)
{
  o *= normalize(resolution).xy;
	
  float flare = smoothstep(0.0, size, length(o));
	
  return flare;
}

void main(void)
{
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec3 color = mix(vec3(0.0), vec3(0.1, 0.2, 0.4), uv.y);
	
  float fThreshhold = 0.995;
	
  float StarVal = noise2d(uv);
	
  if (StarVal >= fThreshhold)
  {
    StarVal = pow((StarVal - fThreshhold) / (1.0 - fThreshhold), 6.0);

    color += vec3(StarVal);
  }

  for (int ii = 0; ii < 100; ii++)
  {
    float i = float(ii);
	  
    float t0 = i * 0.1;

    if (time > t0)
    {
      float t = mod(time - t0, 5.5);
      float size = 1. + 3.0 * hash(i * 10.);

      vec2 pos = uv - vec2(
	      0.5 + 0.25 * (hash(i) - 0.5) * t,
	      0.0 + (0.5 + 0.5 * hash(i + 1.0)) * t - 0.2 * t * t);

      color += mix
	      (
		vec3(0.05, 0.05, 0.0),
		vec3(0.0),
		drawFlare(resolution, pos, 0.05 * size)
      	      );

      color = mix
	      (
		vec3(0.9 + hash(i), 0.9, 0.0),
		color,
		drawStar(resolution, time, pos, 0.0005 * size, pi * hash(i + 1.0)) );
    }
  }
  
  gl_FragColor = vec4(color, 1.0);
}
