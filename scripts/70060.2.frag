
// Mandelbrot Set 

#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265358979323846

#define X1 -2.1
#define X2 0.65
#define Y1 -2.2
#define Y2 2.2

#define ITER 1024

#define COLORS 8


uniform vec2 resolution;
vec3 turbo(float x) {
  const vec4 kRedVec4 = vec4(0.13572138, 4.61539260, -42.91032258, 132.13108234);
  const vec4 kGreenVec4 = vec4(0.09140261, 2.19418839, 4.84296658, -14.18503333);
  const vec4 kBlueVec4 = vec4(0.10667330, 12.64194608, -60.18204836, 110.36276771);
  const vec2 kRedVec2 = vec2(-152.94239396, 59.28637943);
  const vec2 kGreenVec2 = vec2(4.27729857, 2.82956604);
  const vec2 kBlueVec2 = vec2(-89.90310912, 27.34824973); 
  x = smoothstep(0.,1.,fract(x));
  vec4 v4 = vec4( 1.0, x, x * x, x * x * x);
  vec2 v2 = v4.zw * v4.z;
  return vec3(
    dot(v4, kRedVec4)   + dot(v2, kRedVec2),
    dot(v4, kGreenVec4) + dot(v2, kGreenVec2),
    dot(v4, kBlueVec4)  + dot(v2, kBlueVec2)
  );
}
int getIter(float cx, float cy) {
	float zx = cx;
	float zy = cy;
	
	int iter;
	for(int i = 0; i <= ITER; i++){
		
		float tx = zx;
		zx = zx * zx - zy * zy;
		zy = 2.0 * zy * tx;
		zx += cx;
		zy += cy;
		
		if( zx * zx + zy * zy < 4.) {
			iter = i;
		}
		
	}
	
	return iter;
}

vec4 getColor(int iter, float cx, float cy) {
	if(iter == ITER) {
		return vec4(turbo(atan(abs(cy), cx)/radians(180.)),0);	
	}
	
	float i = float(COLORS) * float(iter) / float(256);
	
	
	float r = 0.5 + 0.5 * cos(2. * PI * i + 0. * 2. * PI / 3.);
	float g = 0.5 + 0.5 * cos(2. * PI * i + 1. * 2. * PI / 3.);
	float b = 0.5 + 0.5 * cos(2. * PI * i + 2. * 2. * PI / 3.);
	
	return vec4(turbo(i), 1.0);
}

void main(void)
{
	float x = gl_FragCoord.x;
	float y = gl_FragCoord.y;
	float w = resolution.x;
	float h = resolution.y;
	
	float cx = (((X2-X1)/w)*x+X1);
	float cy = ((((Y2-Y1)/h)*y+Y1)*h/w);
	
	gl_FragColor = getColor(getIter(cx, cy), cx, cy);

}
