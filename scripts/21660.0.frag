#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float PI = 4.*atan(1.);

float fs_con = 1.0/(PI/9.0);
float fs_rad = 1.0/(PI/9.0);
float fs_phs1 = 0.0;
float fs_phs2 = 0.0;
float contr = 0.05;

float Lbg = 49.3/2.0;
float Lmin = 0.0;
float Lmax = 49.3;
float gamma = 2.066;
float BTRR = 63.2;

float box = 1.0;

vec3 lum2image(float c) {
    vec3 vout;
    float U = 255.0*pow(((1.0+c)*Lbg-Lmin)/(Lmax-Lmin),1.0/gamma);
    float b1 = (BTRR+1.0)/BTRR;
    float b = min(floor(U*b1),255.0) + 1.0/32.0;
    float b2 = floor((U-b/b1)*(BTRR+1.0)) + 1.0/32.0;
    vout = vec3(b2/255.0, 0.0 ,b/255.0);
    return vout;
}

void main(void) {
    //float phase = time*0.1*PI;
    float phase = 0.0;
    //float x = gl_TexCoord[0].x - 0.5;
    //float y = -(gl_TexCoord[0].y - 0.5);
    float x = surfacePosition.x;
    float y = surfacePosition.y;
    
    float theta = atan(y, x);
    float r = x*x + y*y;
    float c = 0.0;
    if (sin(6.0*theta+phase) < 0.0)
        c = contr*sin(2.0*PI*fs_rad*(theta-phase)+fs_phs1);
    else
        c = contr*sin(2.0*PI*fs_con*(theta-phase)+fs_phs2);
    float a = exp(-0.5*pow(abs(r-0.03)/0.01,10.0));
    c = c*exp(-0.5*pow(abs(theta-PI/2.0)/1.0,7.0));
    if (box == 1.0) {
       gl_FragColor.rgba = vec4(lum2image(c),1.0);
    } else {
       c = (1.0+c)/2.0;
       gl_FragColor.rgba = vec4(c,c,c,1.0);
    }
}

