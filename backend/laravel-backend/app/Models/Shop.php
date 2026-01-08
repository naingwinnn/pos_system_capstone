<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    //
    protected $fillable = [
        'name',
        'phone',
        'address',
        'description',
        'category',
    ];
    public function products() { return $this->hasMany(Product::class); }
    public function owner() { return $this->belongsTo(User::class, 'user_id'); }

}
