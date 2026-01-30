//  Modded By Dennis Hjorth // @dennishjorth on twitter. 

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ball(vec2 p, float fx, float fy, float ax, float ay, float offsetx, float offsety) {
    vec2 r = vec2(p.x + cos(3.1415*cos(time * fx * 0.25) + offsetx) * ax, p.y + sin(3.1415*sin(time * fy * 0.25) + offsety) * ay);	
    float size = (cos(time*fx*ay*0.2+time*fy*ax*0.1+offsetx+offsety)*0.1);
    float color = (0.09+size*0.3)/length(r);
    color = color > 1.0 ? 1.0 : color;
    color = color*0.15;
    return color;
}

void main(void) {
    vec2 q = gl_FragCoord.xy / resolution.xy;
    vec2 p = -1.0 + 2.0 * q;	
    p.x	*= resolution.x / resolution.y;

    float col1 = 0.0 ,col2 = 0.0, col3 = 0.0;
    col1 += ball(p, 3.0*0.1, 2.0*0.1, 0.3, 0.6, 0.8, 0.7);
    col1 += ball(p, 8.5*0.1, 6.5*0.1, 0.7, 0.7, 0.4, 1.2);
    col1 += ball(p, 2.0*0.1, 3.0*0.1, 0.8, 0.7, 0.6, 0.3);
    col1 += ball(p, 2.5*0.1, 3.5*0.1, 0.4, 0.5, 1.8, 1.4);

    col2 += ball(p, 2.0*0.1, 3.1*0.1, 0.3, 0.9, 0.8, 0.7);
    col2 += ball(p, 8.0*0.1, 7.3*0.1, 0.9, 0.8, 0.4, 1.2);
    col2 += ball(p, 2.5*0.1, 3.5*0.1, 0.5, 0.5, 0.6, 0.3);	
    col2 += ball(p, 7.5*0.1, 3.5*0.1, 0.9, 0.9, 1.8, 1.4);

    col3 += ball(p, 2.5*0.1, 1.1*0.1, 0.3, 0.6, 0.8, 0.7);
    col3 += ball(p, 3.0*0.1, 2.3*0.1, 0.4, 0.3, 0.4, 1.2);
    col3 += ball(p, 8.0*0.1, 7.0*0.1, 0.9, 0.8, 0.6, 0.3);
    col3 += ball(p, 2.5*0.1, 2.5*0.1, 0.7, 0.4, 1.8, 1.4);
	
    float multiplier = 5.8;
    col1 *= multiplier;
    col2 *= multiplier;
    col3 *= multiplier;
	
    float spec = 3.5;
    col1 = pow(col1,spec);
    col2 = pow(col2,spec);
    col3 = pow(col3,spec);
    col1 = col1 > 1.0 ? 1.0 : col1;
    col2 = col2 > 1.0 ? 1.0 : col2;
    col3 = col3 > 1.0 ? 1.0 : col3;

    float r,g,b,r1,g1,b1,r2,g2,b2,r3,g3,b3;
	
    float heavy = 2.0;
    float light = 1.0;

    b1 = col1 * cos(col1) * light;
    g1 = col1 * cos(col1) * heavy; 
    r1 = col1 * cos(col1) * light;

    r2 = col2 * cos(col2) * light;
    g2 = col2 * cos(col2) * light;
    b2 = col2 * cos(col2) * heavy; 
	
    r3 = col3 * cos(col3) * heavy;
    g3 = col3 * cos(col3) * light;
    b3 = col3 * cos(col3) * light;
	
    r = r1 + r2 + r3;
    g = g1 + g2 + g3;
    b = b1 + b2 + b3;	

    gl_FragColor = vec4(r, g, b, 1.0);
}