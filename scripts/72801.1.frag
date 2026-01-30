// - Mandelbrot set -

// github : https://github.com/briossant
// mail : briossant.com@gmail.com
// website : https://briossant.com/

#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265358979323846
#define log2 0.30102999566
uniform float time;
// coordinate range :
#define X1 -2.5
#define X2 1.5
#define Y1 -2.0
#define Y2 2.0

#define ITER 2000    // function iteration

#define COLORS 0.05  // color repeat speed
#define COLORS_2 0.6 // color intesity (between 0. and 1.)


uniform vec2 resolution;


vec2 runMandelbrot(float cx, float cy) {
    float zx;
    float zy;
    for(int i = 0; i <= ITER; i++){
        float n_zx = (zx * zx) - (zy * zy) + cx;
	cx*=1.1;
	cy*=1.1;
	zy = (2. * zx * zy) + cy;
        zx = n_zx;

        float Zn = sqrt(zx * zx + zy * zy);

        if(Zn > 4.) {
            return vec2(zx,zy);
        }
    }
    return vec2(cx,cy);
}





void main(void)
{
    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;
    float w = resolution.x;
    float h = resolution.y;

    float cx = (((X2-X1)*(x/w))+X1);
    float cy = ((((Y2-Y1)*(y/h))+Y1)*h/w);
    vec2 m=runMandelbrot(cx, cy);
    vec2 mn=normalize(runMandelbrot(cx, cy));
    gl_FragColor = vec4(mn.x,mn.y,cos(length(m)),1.0);
}
