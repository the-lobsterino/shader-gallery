precision mediump float;

uniform float time;
uniform vec2 resolution;
const vec4 iMouse = vec4(0.0);

#define texture(s, uv) vec4(1.0)

//旋转角度
mat3 transpose(const in mat3 m)
{
    return mat3(
        m[0][0], m[1][0], m[2][2],
        m[0][1], m[1][1], m[2][1],
        m[0][2], m[1][2], m[2][2]);
}

const float hex_factor = 0.86; //3D墙面峰值
const vec3 fog_color = vec3(0.2, 0.5, 0.5); //整体背景颜色 雾气的颜色

#define HASHSCALE3 vec3(0.1, 0.1, 0.09) //横向墙面颜色
#define HEX_FROM_CART(p) vec2(p.x / hex_factor, p.y)
#define CART_FROM_HEX(g) vec2(g.x * hex_factor, g.y)

//六边形的边距离  用于绘制顶部边框
float hexDist(vec2 p) 
{
    p = abs(p); //绝对值
    return max(dot(p, vec2(hex_factor, 0.5)), p.y) - 1.0; //dot两个向量的乘积 -1.0代表两个六边形的白色层间隔
}

// 给定2D位置，找到最接近中心的整数坐标 平面上最近的六边形
vec2 nearestHexCell(in vec2 pos) 
{       
    vec2 gpos = HEX_FROM_CART(pos); //中心网格数据的坐标
    vec2 hex_int = floor(gpos); //取底部整数 返回小于gpos的最大整数
    //调整整数坐标
    float sy = step(2.0, mod(hex_int.x+1.0, 4.0)); //mod求模取余，与2.0比较 小于2.0返回0，否则返回1
    hex_int += mod(vec2(hex_int.x, hex_int.y + sy), 2.0);
  
    vec2 gdiff = gpos - hex_int;
  
    if (dot(abs(gdiff), vec2(hex_factor*hex_factor, 0.5)) > 1.0) {
        vec2 delta = sign(gdiff) * vec2(2.0, 1.0);
        hex_int += delta;
    }

    return hex_int;   
}

//法线反转
vec2 alignNormal(vec2 h, vec2 d) 
{
    return h*sign(dot(h, CART_FROM_HEX(d))); //sign(x)，如果x>0，返回1.0；如果x=0，返回0，如果x<0，返回-1.0
}

//射线六角相交 将光线与法线为n的六边形壁相交
vec3 rayHexIntersect(vec2 ro, vec2 rd, vec2 h) 
{
    vec2 n = CART_FROM_HEX(h);  
    float u = (1.0 - dot(n, ro)) / dot(n, rd);   
    return vec3(h, u);
}

//射线取小值 选择z坐标最小的向量
vec3 rayMin(vec3 a, vec3 b)
{
    return a.z < b.z ? a : b;
}

vec3 hash32(vec2 p)
{
    vec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);
    p3 += dot(p3, p3.yxz+19.19);
    return fract((p3.xxy+p3.yzz)*p3.zyx); //返回折射向量
}

//返回给定像元中心的像元高度
float height_for_pos(vec2 pos)
{    
    pos += vec2(2.0*sin(time*0.3+0.2), 2.0*cos(time*0.1+0.5 )); //time抖动范围   /**车速变化**/
    
    float x2 = dot(pos, pos);
    float x = sqrt(x2); //x2的开平方根
    
    return 1.0 * cos(x*0.5 + time) * exp(-x2/128.0);//纵深交错的速度 错落 振幅突起的高度  /**转速变化**/
}

//表面状态
vec4 surface(vec3 rd, vec2 cell, vec4 hit_nt, float bdist)
{  
    float fogc = exp(-length(hit_nt.w*rd)*0.01);//墙面上的雾气 雾系数在原点附近为1，在原点附近为0

    vec3 n = hit_nt.xyz;  
    
    vec3 noise = (hash32(cell)-0.5)*0.15;//横向颜色 黑白相间 加入噪声混合
    n = normalize(n + noise); //normalize 标准化向量，返回一个方向和x相同但长度为1的向量
    
    float border_scale = 2.0/resolution.y;//描边虚化 边缘抗锯齿 /**2越大 边缘越模糊**/
    const float border_size = 0.01;//描边粗细 在柱状体六边形 0.02很小裁剪头顶白色六边形的大小 /*** 顶部做一个白色渐变效果 ***/
    
    float border = smoothstep(0.1, border_scale*hit_nt.w, abs(bdist)-border_size);//模糊滤波边缘 描边开关 /*** 顶部白色->蓝色滤波渐变 ***/

    border = mix(border, 0.75, smoothstep(18.0, 45.0, hit_nt.w));//地平线的距离

    vec3 L = normalize(vec3(3, 0.2, 0.51));// 灯光的方向 
    float diffamb = (clamp(dot(n, L), 0.0, 1.0) * 0.8 + 0.2);//clamp取中间值  灯光打到墙面反射颜色的区域多少
    
    vec3 color = vec3(0.0,0.0,0.0); //开始的颜色 白色 
    color = mix(vec3(0.9, 0.1, 0.5), color, border);//RGB色值 加入边框的颜色
    color *= diffamb *1.0; //墙面颜色 0.1变黑
 
    color = mix(color, texture(iChannel0, reflect(rd, n)).yzx, 0.4*border);// 六边形柱体反射
    color = mix(fog_color, color, fogc);
    
    return vec4(color, border);
}

//返回原点为ro且方向为rd的射线的颜色
vec3 shade(in vec3 ro, in vec3 rd) 
{      
    vec3 color = fog_color;    
    vec2 cur_cell = nearestHexCell(ro.xy); //找到距射线原点最近的十六进制中心
    
    //获取该射线的三个候选墙法线 三个十六进制侧面法线，在射线方向上具有正的点积
    vec2 h0 = alignNormal(vec2(0.0, 1.0), rd.xy);
    vec2 h1 = alignNormal(vec2(1.0, 0.5), rd.xy);
    vec2 h2 = alignNormal(vec2(1.0, -0.5), rd.xy);
    
    float cell_height = height_for_pos(CART_FROM_HEX(cur_cell)); //射线起点处的初始像元高度
    
    // 反射系数，类似底片 雾气的透明度
    float alpha = 1.0;
    
    for (int i=0; i<80; ++i) //沿着ray前进，每个像元一次迭代
    {  
        //当光线相交时 进行设置   
        bool hit = false;
        vec4 hit_nt;
        float bdist = 1e5;
        
        vec2 cur_center = CART_FROM_HEX(cur_cell); //经过三项测试后，ht.xy保持十六进制网格方向，ht.z包含射线距离参数
        vec2 rdelta = ro.xy-cur_center;
        
        vec3 ht = rayHexIntersect(rdelta, rd.xy, h0);
        ht = rayMin(ht, rayHexIntersect(rdelta, rd.xy, h1));
        ht = rayMin(ht, rayHexIntersect(rdelta, rd.xy, h2));
        
        float tz = (cell_height - ro.z) / rd.z; //尝试与单元格顶部相交
       
        if (ro.z > cell_height && rd.z < 0.0 && tz < ht.z) //如果光线倾斜向下并且光线在逃离细胞之前与细胞顶部相交
        {         
            hit = true;
            hit_nt = vec4(0, 0, 1.0, tz);   
            vec2 pinter = ro.xy + rd.xy * tz;
            bdist = hexDist(pinter - cur_center); //到边缘的距离
        } 
        else //在到达顶部之前
        {             
            cur_cell += 2.0 * ht.xy; //通过两倍于网格方向更新单元格中心
            
            vec2 n = CART_FROM_HEX(ht.xy);
            cur_center = CART_FROM_HEX(cur_cell);

            float prev_cell_height = cell_height;
            cell_height = height_for_pos(cur_center);
            
            vec3 p_intersect = ro + rd*ht.z; //获取与细胞壁的射线相交点
            
            if (p_intersect.z < cell_height) //等高平面
            {
                //反射很高，同时变白 六边形交集区域设置
                hit_nt = vec4(n, 0.0, ht.y); //ht.z改成ht.y 柱体边缘的颜色  /***柱体边缘的颜色 ***/
                hit = true;
                
                bdist = cell_height - p_intersect.z; //到墙顶的距离            
                bdist = min(bdist, p_intersect.z - prev_cell_height); //距墙底的距离              
                vec2 p = p_intersect.xy - cur_center; //到墙外侧角的距离
                p -= n * dot(p, n);
                
                bdist = min(bdist, abs(length(p) - 0.5/hex_factor));//侧边描边 墙边可见区域
            }
        }                      
        
        if (hit) 
        {                       
            vec4 hit_color = surface(rd, cur_cell, hit_nt, bdist); //阴影表面                    
            color = mix(color, hit_color.xyz, alpha);
            
            //墙面上表面颜色
            alpha *= 0.2 * hit_color.w;
             
            //重新初始化反射射线的射线位置和方向             
            ro = ro + rd*hit_nt.w;
            rd = reflect(rd, hit_nt.xyz); //reflect 返回反向的向量
            ro += 1e-3*hit_nt.xyz;
            
            //重新初始化候选射线方向            
            h0 = alignNormal(vec2(0.0, 1.0), rd.xy);
            h1 = alignNormal(vec2(1.0, 0.5), rd.xy);
            h2 = alignNormal(vec2(1.0, -0.5), rd.xy);
        }
    }    
    //使用剩余的射线能量显示天空
    color = mix(color, fog_color, alpha);   
    return color;    
}    

void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
{
    //镜头位置
    const float yscl = 500.0;
    const float f = 500.0;
    
    vec2 uvn = (fragCoord.xy - 0.5*resolution.xy) / resolution.y;
    vec2 uv = uvn * yscl;
    
    vec3 pos = vec3(-12.0, 0.0, 10.0);
    vec3 tgt = vec3(0.0, 0.0, 0.0);
    vec3 up = vec3(0.0, 0.0, 1.0);
    
    vec3 rz = normalize(tgt - pos);
    vec3 rx = normalize(cross(rz,up)); //cross向量的叉积
    vec3 ry = cross(rx,rz);   
    
    float s = 1.0 + dot(uvn, uvn)*1.5; //计算径向变形
     
    vec3 rd = mat3(rx,ry,rz)*normalize(vec3(uv*s, f));
    vec3 ro = pos;

    float thetax = -0.25 - 0.2*cos(0.03*time);//镜头的角度 距离与旋转   
    float thetay = -0.00*time; //镜头旋转
    
    if (iMouse.y > 10.0 || iMouse.x > 10.0) { 
        thetax = (iMouse.y - 0.5*resolution.y) * -1.25/resolution.y;
        thetay = (iMouse.x - 0.5*resolution.x) * 6.28/resolution.x; 
    }

    float cx = cos(thetax);
    float sx = sin(thetax);
    float cy = cos(thetay);
    float sy = sin(thetay);
    //压缩镜头，变窄
    mat3 Rx = mat3(1.0, 0.0, 0.0, 
                   0.0, cx, sx,
                   0.0, -sx, cx);
    
    mat3 Ry = mat3(cy, 0.0, -sy,
                   0.0, 1.0, 0.0,
                   sy, 0.0, cy);
    
    mat3 R = mat3(0.0, 0.0, 1.0,
                  -1.0, 0.0, 0.0,
                  0.0, 1.0, 0.0);
    
    rd = transpose(R)*Ry*Rx*R*rd;
    ro = transpose(R)*Ry*Rx*R*(pos-tgt) + tgt;

    vec3 color = shade(ro, rd);
    color = sqrt(color); //sqrt取根号
    
    vec2 q = fragCoord.xy / resolution.xy;
        
    color *= pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.0 ); //右边打光 类似东边的太阳       

    fragColor = vec4(color, 1.0);   
}

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}

