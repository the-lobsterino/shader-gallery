#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 color;
const int details = 256;
float CX = -0.25,CY = -0.75;
float zoom = 0.1;
vec2 CAM_POS = vec2(0.0,0.0);
vec2 weird = vec2(2.5,2.5);
float vraizoom = 0.05;
float ZX=0.0, ZY=0.0, newZX=0.0, newZY=0.0;
float speedDegrad = 0.1;

void main(void)
{
    ZX = (float(gl_FragCoord.x) - resolution.x/2.0) / resolution.x / vraizoom + CAM_POS.x;
    ZY = (float(gl_FragCoord.y) - resolution.y/2.0) / resolution.y / vraizoom + CAM_POS.y;
    speedDegrad *= time*1.1;
    weird.x += speedDegrad;
    weird.y += speedDegrad;
    for( int i=0; i < details; i ++ ) {
        newZX = zoom * (ZX * ZX - ZY * ZY + CX) + weird.x;
        newZY = zoom * (2.0 * ZX * ZY + CY) + weird.y;
        ZX = newZX;
        ZY = newZY;
        if( sqrt(ZX * ZX + ZY * ZY ) > 16.0 ) {
            color = vec3((float(i)+20.0)/float(details),(float(i)*float(i))/float(details),(float(i)+float(i)*20.0)/float(details));
            break;
        }
        if( i < details ) {
            color = vec3(0,0,0);
        }
    }
    gl_FragColor = vec4(color,1);
}