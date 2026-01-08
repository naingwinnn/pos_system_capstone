<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Add this:
    protected $fillable = [
        'name',
        'price',
        'image',
        'created_at',
    ];
    public function shop() { return $this->belongsTo(Shop::class); }
    public function stock() { return $this->hasOne(ProductStock::class); }

}
